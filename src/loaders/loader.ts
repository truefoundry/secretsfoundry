// a custom made separator for splitting values

export default abstract class Loader {
  /**
   * This function resolves the value of the input variable by contacting
   * the secretstore and getting the value. It will throw an exception if
   * there is any error in fetching the value.
   * @param args
   */
  public abstract resolve(...args: string[]): Promise<string>;

  /**
   * This function returns true if the loader knows how to get the values for the
   * variable from the source mentioned in the input.
   * @param value The string to be resolved of the format provider(args):/path-to-key
   */
  public abstract canResolve(variable: string): boolean;

  getArgsFromStr(argsStr: string): Record<string, string> {
    const argsMap: Record<string, string> = {};
    if (argsStr) {
      const args = argsStr.trim().split(',');
      for (const arg of args) {
        const keyValue = arg.trim().split('=');
        argsMap[keyValue[0]] = keyValue[1];
      }
    }
    return argsMap;
  }
}
