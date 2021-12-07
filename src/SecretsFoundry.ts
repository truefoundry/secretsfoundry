import dotenv from 'dotenv';
import path from 'path';
import { toposort } from '@n1ru4l/toposort';
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

  getVariablesToResolveNext(
    envVars: Record<string, string>
  ): Array<string> {
    // create the dependency graph of variables
    // dag['a'] = ['b', 'c'] -> 'a' is a dependency for 'b' & 'c'
    const dag: Record<string, Array<string>> = {};
    for (const key in envVars) {
      // all nodes need to be part of the dag
      if (!dag[key]) dag[key] = [];

      const value = envVars[key];
      const groups = [...value.matchAll(this.EXPAND_REGEX)];
      for (const parts of groups) {
        dag[parts[1]] ? dag[parts[1]].push(key) :
          dag[parts[1]] = [key];
      }
    }

    const dependencyMap = new Map();
    // Only include keys in graph which are unresolved.
    // They are not expected to be a dependency for resolved vars anyway
    for (const item of Object.keys(envVars)) {
      dependencyMap.set(item, dag[item]);
    }

    // the first batch contain variables with no dependency; return that
    try {
      return Array.from(toposort(new Map(dependencyMap))[0]);
    } catch (err) {
      if ((err as Error).message.includes('toposort only works on acyclic graphs'))
        throw new Error('Cyclic dependency detected amongst variables');
      else throw err;
    }
  }

  async resolveVariables(
    envVars: Record<string, string>
  ): Promise<Record<string, string>> {
    // unresolvedVars stores all variables that are not resolved yet
    const unresolvedVars = Object.assign({}, envVars);

    while (Object.keys(unresolvedVars).length) {
      // eslint-disable-next-line no-await-in-loop
      await Promise.all(this.getVariablesToResolveNext(unresolvedVars).map(async (key) => {
        let value = envVars[key];

        // Groups are the matches at a given level, since the regex is non-greedy
        // notice the ? mark for the content inside {}. It matches smallest first
        let groups = [...value.matchAll(this.EXPAND_REGEX)];

        const resolvedVars: Array<Record<string, string>> = [];
        await Promise.all(groups.map(async (parts) => {
          resolvedVars.push({
            'key': parts[0],
            'value': await this.resolveVar(parts[1], envVars)
          });
        }));

        for (const resolvedVar of resolvedVars) {
          value = value.replace(resolvedVar['key'], resolvedVar['value']);
        }

        envVars[key] = value;
        groups = [...value.matchAll(this.EXPAND_REGEX)];

        // if braces at all levels are resolved, the variable is considered resolved
        if (groups.length === 0) delete unresolvedVars[key];
        // else, we update the variable with currently resolved braces and resolve higher level braces
        // in subsequent loops
        else unresolvedVars[key] = value;
      }));
    }
    return envVars;
  }

  // We check for the variables defined in the .env file
  // Then we look for the variables in the environment variables.
  // Then check if any of the loaders can resolve the variable.
  async resolveVar(
    variable: string,
    envVars: Record<string, string>
  ): Promise<string> {
    if (envVars[variable]) {
      return envVars[variable];
    } else if (Object.prototype.hasOwnProperty.call(process.env, variable)) {
      // check current env for definition.
      return process.env[variable] as string;
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
