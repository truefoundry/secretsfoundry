import Loader from './loader';
import AwsS3Loader from './AwsS3Loader';
import AwsSecretsLoader from './AwsSecretsLoader';
import AwsSSMLoader from './AwsSSMLoader';
import VaultLoader from './VaultLoader';
import GoogleSecretsLoader from './GoogleSecretsLoader';

export const Loaders: Loader[] = [
  new AwsS3Loader(),
  new AwsSecretsLoader(),
  new AwsSSMLoader(),
  new VaultLoader(),
  new GoogleSecretsLoader()
];
