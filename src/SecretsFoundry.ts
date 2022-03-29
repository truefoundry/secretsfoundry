import { readFileSync } from 'fs';
import dotenv from 'dotenv';
import path from 'path';
import Loader from './loaders/loader';
import { parse } from 'yaml'
import { flatten } from 'flat';
import Utils, { DELIMITER, UnresolvedSecretError } from './utils';

export class SecretsFoundry {
  EXPAND_REGEX = /\${([:a-zA-Z0-9_;(=),\\.\->/]+)?}/g;
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
  public async extractValues(stage: string = '',
    configDir: string = '.',
    inputPath: string | null = null,
    failSilently = false
  ) {
    let envPath: string;

    if (inputPath) {
      envPath = inputPath;
    } else {
      envPath = '.env' + (stage ? `.${stage}` : '');
    }

    let result: Record<string, string>;

    switch (Utils.getFileFormat(envPath)) {
      case ('yml'):
      case ('yaml'): {
        result = flatten(parse(readFileSync(envPath).toString()), {
          delimiter: DELIMITER
        });
        break;
      }
      case ('json'): {
        result = flatten(JSON.parse(readFileSync(envPath).toString()), {
          delimiter: DELIMITER
        });
        break;
      }
      default: {
        result = dotenv.parse(readFileSync(path.join(configDir, envPath)));
      }
    }

    try {
      return await this.resolveVariables(result, failSilently);
    } catch (error) {
      console.error(error);
      throw new Error(error as string);
    }
  }

  async resolveVariables(
    envVars: Record<string, string>,
    failSilently: boolean = false
  ): Promise<Record<string, string>> {
    for (const key in envVars) {
      try {
        // null will resolve to null
        if (!envVars[key] || typeof (envVars[key]) !== "string") {
          continue;
        }

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
      } catch (error) {
        if (error instanceof UnresolvedSecretError && failSilently) {
          continue;
        }
        throw error;
      }
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
      // check current env for definition.
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
      try {
        return await loader.resolve(value);
      } catch (err) {
        throw new UnresolvedSecretError(`${loader.constructor.name} failed to resolve ${value}.\n\n${err}`);
      }
    }
    throw new Error(`No loader exists for: ${value}`);
  }
}
