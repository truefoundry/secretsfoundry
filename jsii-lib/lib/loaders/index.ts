import s3Loader from "./s3Loader";
import secretsLoader from "./secretsLoader";
import ssmLoader from "./ssmLoader";

// a custom made separator for splitting values
export const SEPARATOR = ";;";

export default interface Loader {
  loadData: (...args: string[]) => string | Promise<string>;
}

const Loaders = {
  SECRET: { key: "sec", loader: new secretsLoader() },
  SSM: { key: "ssm", loader: new ssmLoader() },
  S3: { key: "s3", loader: new s3Loader() },
};

export { s3Loader, secretsLoader, ssmLoader, Loaders };
