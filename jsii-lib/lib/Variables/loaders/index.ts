import AWSLoader from "./AwsLoader";
import EnvLoader from "./EnvLoader";
import S3Loader from "./S3Loader";
import SecretsLoader from "./SecretsLoader";
import SSMLoader from "./SSMLoader";

// a custom made separator for splitting values
export const SEPARATOR = ";;";

export default interface BaseLoader {
  loadData: (...args: any[]) => string | Promise<string>;
}

export { AWSLoader, EnvLoader, S3Loader, SecretsLoader, SSMLoader };
