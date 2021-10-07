import Loader from './loader';
import AWS from 'aws-sdk';

/**
 * AwsS3Loader loads the secret from S3 Bucket.
 * We get the AWS credentials from the environment variables
 * AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY. It also falls
 * back to looking up the credentials in local aws config directory
 * if it cannot find the variables set.
 *
 * It accepts two params:
 * region: AWS region to get the parameter from
 * bucket: Bucket name to get the parameter from
 */
export default class AwsS3Loader extends Loader {
  private static PATTERN = /^aws-s3(\((.*)?\))?:((.+?)\/(.+)$)/;

  private static NAME_REGEX = /^[\w/\-._]+$/;
  private static KEY_REGEX = /^[\w]+?/;

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
    const Key = groups[3]; // path to param
    const args = this.getArgsFromStr(argsStr);
    const Bucket: string = args.bucket;

    // validate bucket name
    if (!AwsS3Loader.NAME_REGEX.test(Bucket) || !Bucket) {
      throw new Error(
        'Error while validating bucket name, please check your bucket name'
      );
    }

    // validate key
    if (!AwsS3Loader.KEY_REGEX.test(Key) || !Key) {
      throw new Error(
        'Error while validating bucket key, please check your bucket key'
      );
    }

    const s3 = new AWS.S3({ region: args.region || 'us-east-1' });

    // get secret from AWS Secrets Manager
    try {
      const data = await s3.getObject({ Bucket, Key }).promise();
      // return the value
      if (
        data.ContentType?.startsWith('text') ||
        data.ContentType === 'application/json'
      ) {
        // body is a buffer
        return data.Body?.toString() as string;
      }
      throw new Error('Incompatible data type');
    } catch (error) {
      throw new Error(error as string);
    }
  }
}
