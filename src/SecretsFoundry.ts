import dotenv from 'dotenv';
import Loader from './loaders/loader';

export class SecretsFoundry {
  EXPAND_REGEX = /\${([:a-zA-Z0-9_;(=),\-/]+)?}/g;
  private loaders: Loader[];

  constructor(loaders: Loader[]) {
    this.loaders = loaders;
  }
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
    try {
      return await this.dotenvExpand(result.parsed);
    } catch (error) {
      console.error(error);
      throw new Error(error as string);
    }
  }

  async resolveVariableValue(value: string) {
    const loader = this.loaders.find((loader) => loader.canResolve(value));
    if (loader) {
      return await loader.resolve(value);
    }
    throw new Error(`${value} is not a valid loader`);
  }

  async dotenvExpand(
    envVars: Record<string, string>
  ): Promise<Record<string, string>> {
    for (const key in envVars) {
      let newValue = envVars[key];
      let groups = [...newValue.matchAll(this.EXPAND_REGEX)];
      // Groups are the matches at a given level, since the regex is non-greedy
      // notice the ? mark for the content inside {}. It matches smallest first
      while (groups.length > 0) {
        for (const parts of groups) {
          // parts are the matching groups, parts[1] is the content of the braces
          newValue = newValue.replace(
            parts[0],
            // eslint-disable-next-line no-await-in-loop
            await this.resolveVar(parts[1], envVars)
          );
        }
        // The braces at current level are resolved, and the code then attempts to find
        // vars at a higher level.
        groups = [...newValue.matchAll(this.EXPAND_REGEX)];
      }
      envVars[key] = newValue;
    }
    return envVars;
  }

  async resolveVar(
    variable: string,
    envVars: Record<string, string>
  ): Promise<string> {
    // process.env value 'wins' over .env file's value.
    if (Object.prototype.hasOwnProperty.call(process.env, variable))
      return process.env[variable] as string;
    // check current env for difinition.
    else if (envVars[variable]) return envVars[variable];
    // pass it foundry to be resolved finally.
    return await this.resolveVariableValue(variable);
  }
}
