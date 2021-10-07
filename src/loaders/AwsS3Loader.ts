import Loader from './loader';
import AWS from 'aws-sdk';

export default class AwsS3Loader extends Loader {
  private static PATTERN = /^aws-s3(\((.*)?\))?:([a-zA-Z0-9_.\-\/]+)/;

  private static NAME_REGEX = /^[\w/\-._]+$/;
  private static KEY_REGEX = /^[\w]+?/;

  public canResolve(value: string): boolean {
    if (value.match(AwsS3Loader.PATTERN) !== null) {
      return false;
    }
    return true;
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

    // get the value from s3
    const s3 = new AWS.S3({ region: args.region || 'us-east-1' });
    const data: AWS.S3.GetObjectOutput = await new Promise(function (
      success,
      reject
    ) {
      s3.getObject({ Bucket, Key }, function (err, data) {
        if (err) {
          reject(err);
        } else {
          success(data);
        }
      });
    });

    // return the value
    if (
      data.ContentType?.startsWith('text') ||
      data.ContentType === 'application/json'
    ) {
      // body is a buffer
      return data.Body?.toString() as string;
    }
    throw new Error('Incompatible data type');
  }
}
