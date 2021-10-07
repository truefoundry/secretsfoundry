import Loader, { SEPARATOR } from '.';
import AWS from 'aws-sdk';

export default class SSMLoader implements Loader {
  public async loadData(ssmVariable: string): Promise<string> {
    const REGION_REGEX =
      /^(us(-gov)?|ap|ca|cn|eu|sa)-(central|(north|south)?(east|west)?)-\d?/;
    const NAME_REGEX = /^[\w/\-._]+$/;
    const DECRYPTION_REGEX = /^(true|false)$/;
    const [region, secretName, withDecryption] = ssmVariable.split(SEPARATOR);

    if (!REGION_REGEX.test(region) || !region) {
      throw new Error('Invalid Region provided');
    }

    if (!NAME_REGEX.test(secretName) || !NAME_REGEX) {
      throw new Error('Improper Name provided');
    }

    if (!DECRYPTION_REGEX.test(withDecryption) || !withDecryption) {
      throw new Error('Improper decryption type provided');
    }
    const data =
      await this.fetchData(region, secretName, withDecryption === 'true');
    return data.Parameter?.Value as string;
  }

  private async fetchData(
    region: string,
    secretName: string,
    WithDecryption: boolean
  ): Promise<AWS.SSM.GetParameterResult> {
    const ssm = new AWS.SSM({ region: region });

    return new Promise(function (success, reject) {
      ssm.getParameter(
        { Name: secretName, WithDecryption },
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
