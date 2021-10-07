import Loader, { LoaderOutput, SEPARATOR } from '.';
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
  private static REGION_REGEX =
    /^(us(-gov)?|ap|ca|cn|eu|sa)-(central|(north|south)?(east|west)?)-\d?/;
  private static NAME_REGEX = /^[\w/\-._]+$/;
  private static DECRYPTION_REGEX = /^(true|false)$/;

  static canResolve(value: string): boolean {
    if (value.match(this.PATTERN) !== null) {
      return false;
    }
    const [region, secretName, withDecryption] = value.split(SEPARATOR);
    // TODO: Need to fix the valiation for the new pattern
    if (!AwsSSMLoader.REGION_REGEX.test(region) || !region) {
      return false;
    }
    if (!AwsSSMLoader.NAME_REGEX.test(secretName) || !AwsSSMLoader.NAME_REGEX) {
      return false;
    }
    if (!AwsSSMLoader.DECRYPTION_REGEX.test(withDecryption) || !withDecryption) {
      return false;
    }
    return true;
  }

  public async resolveVariable(ssmVariable: string): Promise<LoaderOutput> {
    if (!AwsSSMLoader.canResolve(ssmVariable)) {
      return { canResolve: false };
    }
    const [region, secretName, withDecryption] = ssmVariable.split(SEPARATOR);
    const ssm = new AWS.SSM({ region: region });
    const data = await ssm
      .getParameter({
        Name: secretName,
        WithDecryption: withDecryption === 'true',
      })
      .promise();
    return { canResolve: true, resolvedOutput: data.Parameter?.Value as string };
  }

}
