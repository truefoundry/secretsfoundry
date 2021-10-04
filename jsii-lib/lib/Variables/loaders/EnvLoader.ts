import BaseLoader from "./index";

export default class EnvLoader implements BaseLoader {
  public loadData(env_variable: string): string {
    if (!process.env[env_variable]) {
      throw new Error(`No Env variable with name ${env_variable}`);
    }
    return process.env[env_variable] as string;
  }
}
