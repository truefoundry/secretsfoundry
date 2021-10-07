import { Loaders } from '@/loaders';
import dotenv from 'dotenv';

export class SecretsFoundry {
  VARIABLES_MATCH = /\${[\w]+?:.+?}/g;
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
      throw new Error(error as string);
    }
  }

  async resolveVariableValue(value: string) {
    const variables = this.VARIABLES_MATCH.exec(value);
    if (variables) {
      const varExp = variables[0].substring(2, variables[0].length - 1);
      const firstColonIndex = varExp.indexOf(':');
      const refKey = varExp.substr(0, firstColonIndex);
      const refValue = varExp.substr(firstColonIndex + 1);
      switch (refKey) {
        case Loaders.SSM.key:
          return await Loaders.SSM.loader.loadData(refValue);

        case Loaders.SECRET.key:
          return await Loaders.SECRET.loader.loadData(refValue);

        case Loaders.S3.key:
          return await Loaders.S3.loader.loadData(refValue);

        default:
          throw new Error(`${refKey} is not a valid loader`);
      }
    }
    // a default return for no variable
    return value;
  }
}
