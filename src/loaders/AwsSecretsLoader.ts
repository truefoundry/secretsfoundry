import Loader, { SEPARATOR } from '.';

import AWS from 'aws-sdk';
import { Buffer } from 'buffer';

export default class SecretsLoader implements Loader {
  public async loadData(secretsVariable: string): Promise<string> {
    const REGION_REGEX =
      /^(us(-gov)?|ap|ca|cn|eu|sa)-(central|(north|south)?(east|west)?)-\d?/;
    const NAME_REGEX = /^[\w-]+$/;
    const [region, secretName] = secretsVariable.split(SEPARATOR);

    if (!REGION_REGEX.test(region)) {
      throw new Error('Invalid Region provided');
    }
    if (!NAME_REGEX.test(secretName)) {
      throw new Error('Improper Name provided');
    }
    const data = await this.fetchData(
      region,
      secretName
    );
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
      return data.SecretString as string;
    } else {
      const buff = Buffer.from(data.SecretBinary as string, 'base64');
      return buff.toString('ascii');
    }
  }

  private async fetchData(region: string, secretName: string): Promise<AWS.SecretsManager.GetSecretValueResponse> {
    const client = new AWS.SecretsManager({
      region: region,
    });

    return new Promise(function (success, reject) {
      client.getSecretValue(
        { SecretId: secretName },
        function (err, data) {
          if (err) {
            reject(err);
          } else {
            success(data);
          }
        }
      );
    });
  }
}
