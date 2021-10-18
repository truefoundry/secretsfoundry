import Loader from './loader';
import AWS from 'aws-sdk';

/**
 * AwsS3Loader loads the secret from S3 Bucket.
 * This loader accepts pattern of the format
 * aws-s3(params):/key-to-param
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
 * @param bucket: Bucket name to get the parameter from
 */
export default class AwsS3Loader extends Loader {
  private static PATTERN = /^aws-s3(\((.*)?\))?:((.+?)\/(.+)$)/;

  public canResolve(value: string): boolean {
    return value.match(AwsS3Loader.PATTERN) !== null;
  }

  public async resolve(s3Variable: string): Promise<string> {
    const groups = s3Variable.match(AwsS3Loader.PATTERN);
    if (groups === null) {
      throw new Error(
        'AwsSSMLoader cannot parse the variable name. This should never happen \
      since client is supposed to be calling canResolve first'
      );
    }
    const argsStr = groups[2]; // args
    const args = this.getArgsFromStr(argsStr);

    const Bucket: string = groups[4]; // path to param
    const Key = groups[5]; // path to file

    let s3: AWS.S3;
    if (args.region) {
      s3 = new AWS.S3({ region: args.region });
    } else {
      s3 = new AWS.S3();
    }
    // get secret from AWS Secrets Manager
    const data = await s3.getObject({ Bucket, Key }).promise();
    // return the value
    if (
      data.ContentType?.startsWith('text') ||
      data.ContentType === 'application/json'
    ) {
      // body is a buffer
      return data.Body?.toString() as string;
    }
    throw new Error('S3 object datatype should be text or json');
  }
}
