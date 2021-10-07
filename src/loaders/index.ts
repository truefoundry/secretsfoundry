import awsS3Loader from './AwsS3Loader';
import awsSecretsLoader from './AwsSecretsLoader';
import awsSSMLoader from './AwsSSMLoader';
import vaultLoader from './VaultLoader';

export const Loaders: ILoader[] = [
  new awsS3Loader(),
  new awsSecretsLoader(),
  new awsSSMLoader(),
  new vaultLoader()
];
