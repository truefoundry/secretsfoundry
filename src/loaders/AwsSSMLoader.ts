import Loader from './loader';
import AWS from 'aws-sdk';

/**
 * AWSSSMLoader loads the variable from AWS Parameter Store.
 * We get the AWS credentials from the environment variables
 * AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY. It also falls
 * back to looking up the credentials in local aws config directory
 * if it cannot find the variables set.
 *
 * It accepts two params:
 * @param region: AWS region to get the parameter from
 * @param decrypt: Boolean to indicate whether to decrypt or not
 */
export default class AwsSSMLoader extends Loader {
  private static PATTERN = /^aws-ssm(\((.*)?\))?:([a-zA-Z0-9_.\-/]+)$/;

  public canResolve(value: string): boolean {
    return value.match(AwsSSMLoader.PATTERN) !== null;
  }

  public async resolve(ssmVariable: string): Promise<string> {
    const groups = ssmVariable.match(AwsSSMLoader.PATTERN);
    if (groups === null) {
      throw new Error(
        'AwsSSMLoader cannot parse the variable name. This should never happen \
        since client is supposed to be calling canResolve first'
      );
    }
    const argsStr = groups[2]; // args
    const paramName = groups[3]; // path to param
    const args = this.getArgsFromStr(argsStr);
    // Validate decrypt param
    let decrypt = false;
    if ('decrypt' in args) {
      const decryptArg = args.decrypt
      if (decryptArg === 'true') {
        decrypt = true;
      } else if (decryptArg === 'false') {
        decrypt = false;
      } else {
        throw new Error('decrypt value has to be true or false');
      }
    }
    let ssm: AWS.SSM;
    if (args.region) {
      ssm = new AWS.SSM({ region: args.region });
    } else {
      ssm = new AWS.SSM();
    }
    const data = await ssm
      .getParameter({
        Name: paramName,
        WithDecryption: decrypt,
      })
      .promise();
    return data.Parameter?.Value as string;
  }
}
