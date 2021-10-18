import dotenv from 'dotenv';
import path from 'path';
import Loader from './loaders/loader';

export class SecretsFoundry {
  EXPAND_REGEX = /\${([:a-zA-Z0-9_;(=),\\.\-/]+)?}/g;
  private loaders: Loader[];

  constructor(loaders: Loader[]) {
    this.loaders = loaders;
  }
  /**
   * Reads values from the file stage specified and populates the variables
   * @param stage Stage for the process.
   * @param configDir Path to directory which contains the .env files. Defaults to .
   * @returns Object/dict containing key and corresponding populated variable value
   */
  public async extractValues(stage: string = '', configDir: string = '.') {
    const envPath = '.env' + (stage ? `.${stage}` : '');
    const result = dotenv.config({ path: path.join(configDir, envPath) });
    if (result.error || !result.parsed) {
      throw result.error;
    }
    try {
      return await this.resolveVariables(result.parsed);
    } catch (error) {
      console.error(error);
      throw new Error(error as string);
    }
  }

  async resolveVariables(
    envVars: Record<string, string>
  ): Promise<Record<string, string>> {
    for (const key in envVars) {
      let value = envVars[key];
      let groups = [...value.matchAll(this.EXPAND_REGEX)];
      // Groups are the matches at a given level, since the regex is non-greedy
      // notice the ? mark for the content inside {}. It matches smallest first
      while (groups.length > 0) {
        for (const parts of groups) {
          // parts are the matching groups, parts[1] is the content of the braces
          value = value.replace(
            parts[0],
            // eslint-disable-next-line no-await-in-loop
            await this.resolveVar(parts[1], envVars)
          );
        }
        // The braces at current level are resolved, and the code then attempts to find
        // vars at a higher level.
        groups = [...value.matchAll(this.EXPAND_REGEX)];
      }
      envVars[key] = value;
    }
    return envVars;
  }

  // We first look for the variables in the environment variables.
  // Then check for the variables defined earlier in the .env file
  // Then check if any of the loaders can resolve the variable.
  async resolveVar(
    variable: string,
    envVars: Record<string, string>
  ): Promise<string> {
    if (Object.prototype.hasOwnProperty.call(process.env, variable)) {
      // check current env for difinition.
      return process.env[variable] as string;
    } else if (envVars[variable]) {
      return envVars[variable];
    }
    // pass it foundry to be resolved finally.
    return await this.getValueFromLoaders(variable);
  }

  async getValueFromLoaders(value: string) {
    const loader = this.loaders.find((loader) => loader.canResolve(value));
    if (loader) {
      return await loader.resolve(value);
    }
    throw new Error(`No loader exists for: ${value}`);
  }
}
