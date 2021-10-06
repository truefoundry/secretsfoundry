import variables from "./variables";

export class SecretsFoundry {
  /**
   * Extracts the values read from a file and populates the variables present
   * @param data An object/dict containing key,value (both strings)
   * @returns Object/dict containing key and corresponding populated value
   */
  public async extractValues(data: { [key: string]: string }) {
    let keys: string[] = [];
    let values: Promise<string>[] = [];
    let extractedValues: { [key: string]: string | Promise<string> } = {};
    for (const key in data) {
      keys.push(key);
      values.push(new variables().populate(data[key]));
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
