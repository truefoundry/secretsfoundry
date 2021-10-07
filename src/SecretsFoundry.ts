import dotenv from 'dotenv';

export class SecretsFoundry {
  VARIABLES_MATCH = /([\w]+?):(.+)/g;
  EXPAND_REGEX = /\${([:a-zA-Z0-9_;(=)\-/]+)?}/g;
  private loaders: ILoader[];

  constructor(loaders: ILoader[]) {
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
    const variables = [...value.matchAll(this.VARIABLES_MATCH)];
    if (variables.length > 0) {
      const [, refKey, refValue] = variables[0];

      const loader = this.loaders.find(
        loader => loader.canResolve(value)
      );

      if (loader) {
        return await loader.resolve(refValue);
      } else {
        throw new Error(`${refKey} is not a valid loader`);
      }
    }
    // a default return for no variable
    return value;
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
          // The braces at current level are resolved, and the code then attempts to find
          // vars at a higher level.
          groups = [...newValue.matchAll(this.EXPAND_REGEX)];
        }
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
