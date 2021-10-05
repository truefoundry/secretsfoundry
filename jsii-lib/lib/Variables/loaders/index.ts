import AWSLoader from "./AwsLoader";
import S3Loader from "./S3Loader";
import SecretsLoader from "./SecretsLoader";
import SSMLoader from "./SSMLoader";

// a custom made separator for splitting values
export const SEPARATOR = ";;";

export default interface Loader {
  loadData: (...args: string[]) => string | Promise<string>;
}

const Loaders = {
  AWS: { key: "aws", loader: new AWSLoader() },
  SECRET: { key: "sec", loader: new SecretsLoader() },
  SSM: { key: "ssm", loader: new SSMLoader() },
  S3: { key: "s3", loader: new S3Loader() },
};

export { AWSLoader, S3Loader, SecretsLoader, SSMLoader, Loaders };
