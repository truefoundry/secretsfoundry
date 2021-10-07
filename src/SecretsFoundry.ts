import { Loaders } from './loaders';
import dotenv from 'dotenv';

export class SecretsFoundry {
  VARIABLES_MATCH = /\${([\w]+?:.+?)}/g;
  EXPAND_REGEX = /(.?\${?(?:[a-zA-Z0-9_]+)?}?)/g;
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
      const parts = this.EXPAND_REGEX.exec(inputConfig[key]);
      if (parts) {
        const prefix = parts[1];
        let value: string, replacePart: string;
  
        if (prefix === '\\') {
          replacePart = parts[0];
          value = replacePart.replace('\\$', '$');
        } else {
          const key = parts[2];
          replacePart = parts[0].substring(prefix.length);
          // process.env value 'wins' over .env file's value
          if (Object.prototype.hasOwnProperty.call(environment, key))
            value = environment[key] as string;
          else if (inputConfig[key])
            value = inputConfig[key];
          else {
            foundryVars.push(key);
            continue;
          }
        }
        inputConfig[key] = inputConfig[key].replace(replacePart, value);
      }
    }

    for (const foundryKey of foundryVars) {
      let newValue = inputConfig[foundryKey];
      const subCommands = this.VARIABLES_MATCH.exec(newValue);
      if (subCommands) {
        let match: RegExpExecArray | null;
        let nextValue = newValue;
        while( match = this.EXPAND_REGEX.exec(subCommands[1]) ) {
          nextValue.replace(match[2], inputConfig[match[2]] || match[2]);
        }
        newValue = nextValue;
      }
      inputConfig[foundryKey] = await this.resolveVariableValue(newValue);
    }

    for (const processKey in inputConfig) {
      environment[processKey] = inputConfig[processKey];
    }
    return inputConfig
  }
}
