import { Loaders } from './loaders';
import dotenv from 'dotenv';

export class SecretsFoundry {
  VARIABLES_MATCH = /\${([\w]+?):(.+?)}/g;
  EXPAND_REGEX = /((?:\\{2})?)\${([:a-zA-Z0-9_;\-/]+)?}/g;
  /**
   * Reads values from the file stage specified and populates the variables
   * @param stage Stage for the process. Defaults to development
   * @returns Object/dict containing key and corresponding populated variable value
   */
  public async extractValues(stage: string = 'development') {
    const result = dotenv.config({ path: `./.env.${stage}` });
    if (result.error || !result.parsed) {
      throw result.error;
    }
    const fileValues = result.parsed;

    try {
      return await this.dotenvExpand(fileValues);
    } catch (error) {
      console.error(error);
      throw new Error(error as string);
    }
  }

  async resolveVariableValue(value: string) {
    const variables = this.VARIABLES_MATCH.exec(value);
    this.VARIABLES_MATCH.lastIndex = 0;
    if (variables) {
      const refKey = variables[1];
      const refValue = variables[2];

      const loader = Object.values(Loaders).find((mode) => mode.key === refKey);

      if (loader) {
        return await loader.loader.loadData(refValue);
      } else {
        throw new Error(`${refKey} is not a valid loader`);
      }
    }
    // a default return for no variable
    return value;
  }

  async dotenvExpand(inputConfig: dotenv.DotenvParseOutput): Promise<{ [key: string]: string; }> {
    const environment = process.env;
    const foundryVars: string[] = [];
    for (const key in inputConfig) {
      let newValue = inputConfig[key]
      let parts = this.EXPAND_REGEX.exec(newValue);
      this.EXPAND_REGEX.lastIndex = 0; // reset regex
      while (parts) { 
        const prefix = parts[1];
        let value: string, replacePart: string;
  
        if (prefix === '\\') {
          replacePart = parts[0];
          value = replacePart.replace('\\$', '$');
        } else {
          const replacementKey = parts[2];
          replacePart = parts[0].substring(prefix.length);
          // process.env value 'wins' over .env file's value
          if (Object.prototype.hasOwnProperty.call(environment, replacementKey))
            value = environment[replacementKey] as string;
          else if (inputConfig[replacementKey])
            value = inputConfig[replacementKey];
          else {
            foundryVars.push(key);
            break;
          }
        }
        newValue = newValue.replace(replacePart, value);
        parts = this.EXPAND_REGEX.exec(newValue)
        this.EXPAND_REGEX.lastIndex = 0; // reset regex
      }
      inputConfig[key] = newValue;
    }
    const values: Promise<string>[] = [];
    for (const foundryKey of foundryVars) {
      const newValue = inputConfig[foundryKey];
      values.push(this.resolveVariableValue(newValue));
    }
    const results = await Promise.all(values);
    foundryVars.forEach((key, i) => {
      inputConfig[key] = results[i];
    })
    return inputConfig;
  }
}
