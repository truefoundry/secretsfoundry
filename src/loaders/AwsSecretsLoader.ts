import Loader from './loader';

import AWS from 'aws-sdk';
import { Buffer } from 'buffer';

/**
 * AwsSecretsLoader loads the secret from AWSSecretsManager.
 * We get the AWS credentials from the environment variables
 * AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY. It also falls
 * back to looking up the credentials in local aws config directory
 * if it cannot find the variables set.
 *
 * It accepts two params:
 * @param region: AWS region to get the parameter from
 */
export default class AwsSecretsLoader extends Loader {
  private static PATTERN = /^aws-secrets(\((.*)?\))?:([a-zA-Z0-9_.\-\/]+)$/;

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

    const client = new AWS.SecretsManager({
      region: args.region || 'us-east-1',
    });

    // get secret from AWS Secrets Manager
    try {
      const result = await client
        .getSecretValue({ SecretId: secretName })
        .promise();
      if ('SecretString' in result) {
        return result.SecretString as string;
      }
      throw new Error('No SecretString in the Secret: `${secretsVariable}`');
    } catch (error) {
      throw new Error(error as string);
    }
  }
}
