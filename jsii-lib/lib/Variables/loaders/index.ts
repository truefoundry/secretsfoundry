import AWSLoader from "./AwsLoader";
import EnvLoader from "./EnvLoader";
import SecretsLoader from "./SecretsLoader";

export default interface BaseLoader {
  loadData: (...args: any[]) => string | Promise<string>;
}

export { AWSLoader, EnvLoader, SecretsLoader };
