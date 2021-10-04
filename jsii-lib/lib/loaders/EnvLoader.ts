import BaseLoader from './BaseLoader';

export default class EnvLoader implements BaseLoader {
  public loadData(env_variable: string): string {
    return process.env[env_variable] as string;
  }
}
