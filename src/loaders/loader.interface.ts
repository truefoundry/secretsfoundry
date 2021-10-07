// a custom made separator for splitting values
export const SEPARATOR = ';;';

export default abstract class Loader {
  /**
   * This function resolves the value of the input variable by contacting
   * the secret manager store and getting the value
   * @param args
   */
  public abstract resolve(...args: string[]): Promise<string>;

  /**
   * This function returns true if the loader knows how to get the values for the
   * variable from the source mentioned in the input.
   * @param value The string to be resolved of the format provider(args):/path-to-key
   */
  static canResolve = function (variable: string): boolean {
    throw new Error('Not Implemented!');
  };

  static getArgsFromStr(argsStr: string): Record<string, string> {
    const argsMap: Record<string, string> = {};
    if (argsStr) {
      const args = argsStr.trim().split(',');
      for (const arg in args) {
        const keyValue = arg.trim().split('=');
        argsMap[keyValue[0]] = keyValue[1];
      }
    }
    return argsMap;
  }
}