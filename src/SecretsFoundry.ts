import { Loaders } from './loaders';
import dotenv from 'dotenv';

export class SecretsFoundry {
  VARIABLES_MATCH = /\${([\w]+?):(.+?)}/g;
  /**
   * Reads values from the file stage specified and populates the variables
   * @param stage Stage for the process. Defaults to development
   * @returns Object/dict containing key and corresponding populated variable value
   */
  public async extractValues(stage: string = 'development') {
    const keys: string[] = [];
    const values: Promise<string>[] = [];
    const extractedValues: { [key: string]: string | Promise<string> } = {};
    const result = dotenv.config({ path: `./.env.${stage}` });
    if (result.error) {
      throw result.error;
    }
    const fileValues = result.parsed;

    for (const key in fileValues) {
      keys.push(key);
      values.push(this.resolveVariableValue(fileValues[key]));
    }
    try {
      const results = await Promise.all(values);
      keys.forEach((key, idx) => {
        // assign the key-value pair
        extractedValues[key] = results[idx];
      });
      return extractedValues;
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
  dotenvExpand(inputConfig: { [key: string]: string }): { [key: string]: string } {
    const environment = process.env;
    const interpolate = function (envValue: string): string {
      const matches = envValue.match(/(.?\${?(?:[a-zA-Z0-9_]+)?}?)/g) || []

      return matches.reduce(function (newEnv, match) {
        const parts = /(.?)\${?([a-zA-Z0-9_]+)?}?/g.exec(match) || '';
        const prefix = parts[1];

        let value, replacePart

        if (prefix === '\\') {
          replacePart = parts[0]
          value = replacePart.replace('\\$', '$')
        } else {
          const key = parts[2]
          replacePart = parts[0].substring(prefix.length)
          // process.env value 'wins' over .env file's value
          value = Object.prototype.hasOwnProperty.call(environment, key) ? environment[key] : (inputConfig[key] || '')

          // Resolve recursive interpolations
          value = interpolate(value || '')
        }
        return newEnv.replace(replacePart, value)
      }, envValue)
    }
    for (const configKey in inputConfig) {
      const value = Object.prototype.hasOwnProperty.call(environment, configKey) ? environment[configKey] : inputConfig[configKey]

      inputConfig[configKey] = interpolate(value || '')
    }

    for (const processKey in inputConfig) {
      environment[processKey] = inputConfig[processKey]
    }
    return inputConfig
  }
}
