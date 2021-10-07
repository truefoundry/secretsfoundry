import awsS3Loader from './AwsS3Loader';
import awsSecretsLoader from './AwsSecretsLoader';
import awsSSMLoader from './AwsSSMLoader';

// a custom made separator for splitting values
export const SEPARATOR = ';;';

export default interface Loader {
  loadData: (...args: string[]) => string | Promise<string>;
}

const Loaders = {
  SECRET: { key: 'sec', loader: new awsSecretsLoader() },
  SSM: { key: 'ssm', loader: new awsSSMLoader() },
  S3: { key: 's3', loader: new awsS3Loader() },
};

export { awsS3Loader, awsSecretsLoader, awsSSMLoader, Loaders };
