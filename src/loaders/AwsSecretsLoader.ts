import Loader, { LoaderOutput, SEPARATOR } from '.';

import AWS from 'aws-sdk';
import { Buffer } from 'buffer';

export default class AwsSecretsLoader implements Loader {
  private static REGION_REGEX =
    /^(us(-gov)?|ap|ca|cn|eu|sa)-(central|(north|south)?(east|west)?)-\d?/;
  private static NAME_REGEX = /^[\w-]+$/;

  static canResolve = function (value: string): boolean {
    const [region, secretName] = value.split(SEPARATOR);
    if (!AwsSecretsLoader.REGION_REGEX.test(region)) {
      return false;
    }
    if (!AwsSecretsLoader.NAME_REGEX.test(secretName)) {
      return false;
    }
    return true;
  };

  public async resolveVariable(secretsVariable: string): Promise<LoaderOutput> {
    const [region, secretName] = secretsVariable.split(SEPARATOR);

    const client = new AWS.SecretsManager({
      region: region,
    });
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
    if ('SecretString' in data) {
      return { canResolve: true, resolvedOutput: data.SecretString as string };
    } else {
      const buff = Buffer.from(data.SecretBinary as string, 'base64');
      return { canResolve: true, resolvedOutput: buff.toString('ascii') };
    }
  }
}
