import Loader, { LoaderOutput, SEPARATOR } from '.';
import AWS from 'aws-sdk';

export default class AwsS3Loader extends Loader {
  private static REGION_REGEX =
    /^(us(-gov)?|ap|ca|cn|eu|sa)-(central|(north|south)?(east|west)?)-\d?/;
  private static NAME_REGEX = /^[\w/\-._]+$/;
  private static KEY_REGEX = /^[\w]+?/;
  static canResolve = function (value: string): boolean {
    const [region, bucket, key] = value.split(SEPARATOR);
    if (!AwsS3Loader.REGION_REGEX.test(region) || !region) {
      return false;
    }
    if (!AwsS3Loader.NAME_REGEX.test(bucket) || !AwsS3Loader.NAME_REGEX) {
      return false;
    }
    if (!AwsS3Loader.KEY_REGEX.test(key) || !key) {
      return false;
    }
    return true;
  };
  public async resolveVariable(s3Variable: string): Promise<LoaderOutput> {
    const [region, Bucket, Key] = s3Variable.split(SEPARATOR);
    const s3 = new AWS.S3({ region: region });
    const data: AWS.S3.GetObjectOutput = await new Promise(function (success, reject) {
      s3.getObject({ Bucket, Key }, function (err, data) {
        if (err) {
          reject(err);
        } else {
          success(data);
        }
      });
    });
    if (
      data.ContentType?.startsWith('text') ||
      data.ContentType === 'application/json'
    ) {
      // body is a buffer
      return { canResolve: true, resolvedOutput: data.Body?.toString() as string };
    }
    throw new Error('Incompatible data type');
  }

}
