import Loader from './loader';

import AWS from 'aws-sdk';

/**
 * AwsSecretsLoader loads the secret from AWSSecretsManager.
 * This loader accepts pattern of the format
 * aws-secrets(params):/key-to-param
 *
 * Requirements:
 *
 * AWS credentials from the environment variables
 * AWS_ACCESS_KEY_ID
 * AWS_SECRET_ACCESS_KEY.
 *
 * It also falls back to looking up the credentials in local
 * aws config directory if it cannot find the variables set.
 *
 * @param region: AWS region to get the parameter from
 */
export default class AwsSecretsLoader extends Loader {
  private static PATTERN = /^aws-secrets(\(([:a-zA-Z0-9_;(=),\\.\-/]*)?\))?:([a-zA-Z0-9_.\-/]+)$/;

  public canResolve(value: string): boolean {
    return value.match(AwsSecretsLoader.PATTERN) !== null;
  }

  public async resolve(secretsVariable: string): Promise<string> {
    const groups = secretsVariable.match(AwsSecretsLoader.PATTERN);
    if (groups === null) {
      throw new Error(
        'AwsSSMLoader cannot parse the variable name. This should never happen \
      since client is supposed to be calling canResolve first'
      );
    }

    const argsStr = groups[2]; // args
    const secretName = groups[3]; // path to param
    const args = this.getArgsFromStr(argsStr);
    let client: AWS.SecretsManager;
    if (args.region) {
      client = new AWS.SecretsManager({ region: args.region });
    } else {
      client = new AWS.SecretsManager();
    }
    // get secret from AWS Secrets Manager
    const result = await client
      .getSecretValue({ SecretId: secretName })
      .promise();
    if ('SecretString' in result) {
      return result.SecretString as string;
    }
    throw new Error('No SecretString in the Secret: `${secretsVariable}`');
  }
}
