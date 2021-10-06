import variables from "./variables";
const dotenv = require("dotenv");

export class SecretsFoundry {
  /**
   * Reads values from the file stage specified and populates the variables
   * @param stage Stage for the process. Defaults to development
   * @returns Object/dict containing key and corresponding populated variable value
   */
  public async extractValues(stage: string = "development") {
    let keys: string[] = [];
    let values: Promise<string>[] = [];
    let extractedValues: { [key: string]: string | Promise<string> } = {};
    const result = dotenv.config({ path: `./.env.${stage}` });
    if (result.error) {
      throw result.error;
    }
    const fileValues = result.parsed;
    for (const key in fileValues) {
      keys.push(key);
      values.push(new variables().populate(fileValues[key]));
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
}
