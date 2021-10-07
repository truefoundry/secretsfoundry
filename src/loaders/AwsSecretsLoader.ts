import Loader from './loader.interface';

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
 * region: AWS region to get the parameter from
 * decrypt: Boolean to indicate whether to decrypt or not
 */
export default class AwsSecretsLoader extends Loader {
  private static PATTERN = /^aws-secrets(\((.*)?\))?:([a-zA-Z0-9_.\-\/]+)/;

  private static NAME_REGEX = /^[\w-]+$/;

  public canResolve(value: string): boolean {
    if (value.match(AwsSecretsLoader.PATTERN) !== null) {
      return false;
    }
    return true;
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

    // validate secret name
    if (!AwsSecretsLoader.NAME_REGEX.test(secretName)) {
      throw new Error(
        'Error while validating secret name, please check your secret name'
      );
    }

    const args = this.getArgsFromStr(argsStr);

    const client = new AWS.SecretsManager({
      region: args.region || 'us-east-1',
    });

    // get secret from AWS Secrets Manager
    const data: { [key: string]: string } = await new Promise(function (success, reject) {
      client.getSecretValue({ SecretId: secretName }, function (err, data) {
        if (err) {
          reject(err);
        } else {
          success(data as { [key: string]: string });
        }
      });
    });
    /**
     * {
          ARN: '',
          Name: '',
          VersionId: '',
          SecretString: '',
          VersionStages: [ '' ],
          CreatedDate: Date
        }
      */

    if (!args.raw) {
      return data.SecretString as string;
    } else {
      const buff = Buffer.from(data.SecretBinary as string, 'base64');
      return buff.toString('ascii');
    }
  }
}
