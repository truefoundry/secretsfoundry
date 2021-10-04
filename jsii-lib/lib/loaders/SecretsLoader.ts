import BaseLoader from './BaseLoader';

// import BaseLoader from './BaseLoader';
const AWS = require('aws-sdk');
// const Buffer = require('buffer');

export default class SecretsLoader implements BaseLoader {
  public async loadData(secrets_variable: string): Promise<string> {
    const REGION_REGEX =
      /^(us(-gov)?|ap|ca|cn|eu|sa)-(central|(north|south)?(east|west)?)-\d?/;
    const NAME_REGEX = /^[\w\-]+$/;
    const [region, secretName] = secrets_variable.split('/');

    if (!REGION_REGEX.test(region)) {
      throw new Error('Invalid Region provided');
    }
    if (!NAME_REGEX.test(secretName)) {
      throw new Error('Improper Name provided');
    }

    const data = await this.fetchData(region, secretName);
    return data.SecretString;
  }

  private async fetchData(region: string, secretName: string): Promise<any> {
    const client = new AWS.SecretsManager({
      region: region,
    });

    return new Promise(function (success, reject) {
      client.getSecretValue(
        { SecretId: secretName },
        function (err: any, data: { [key: string]: string }) {
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
