import Loader, { SEPARATOR } from '.';
import AWS from 'aws-sdk';

/**
 * AWSSSMLoader loads the variable from AWS Parameter Store.
 * We get the AWS credentials from the environment variables
 * AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY. It also falls
 * back to looking up the credentials in local aws config directory
 * if it cannot find the variables set.
 */
export default class AwsSSMLoader implements Loader {
  private static PATTERN = /^aws-ssm(\(.*?\))?:([a-zA-Z0-9_.\-\/]+)/;
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
    const data = await this.fetchData(
      region,
      secretName,
      withDecryption === 'true'
    );
    return data.Parameter?.Value as string;
  }

  static canResolve(value: string): boolean {
    return value.match(this.PATTERN) !== null;
  }

  private async fetchData(
    region: string,
    secretName: string,
    WithDecryption: boolean
  ): Promise<AWS.SSM.GetParameterResult> {
    const ssm = new AWS.SSM({ region: region });
    return ssm
      .getParameter({
        Name: secretName,
        WithDecryption: WithDecryption,
      })
      .promise();
  }
}
