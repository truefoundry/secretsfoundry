import awsLoader from "./awsLoader";
import s3Loader from "./s3Loader";
import secretsLoader from "./secretsLoader";
import ssmLoader from "./ssmLoader";

// a custom made separator for splitting values
export const SEPARATOR = ";;";

export default interface Loader {
  loadData: (...args: string[]) => string | Promise<string>;
}

const Loaders = {
  AWS: { key: "aws", loader: new awsLoader() },
  SECRET: { key: "sec", loader: new secretsLoader() },
  SSM: { key: "ssm", loader: new ssmLoader() },
  S3: { key: "s3", loader: new s3Loader() },
};

export { awsLoader, s3Loader, secretsLoader, ssmLoader, Loaders };
