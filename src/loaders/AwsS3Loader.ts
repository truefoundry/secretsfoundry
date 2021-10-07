import Loader, { SEPARATOR } from '@/loaders';
import AWS from 'aws-sdk';

export default class S3Loader implements Loader {
  public async loadData(s3Variable: string): Promise<string> {
    const REGION_REGEX =
      /^(us(-gov)?|ap|ca|cn|eu|sa)-(central|(north|south)?(east|west)?)-\d?/;
    const NAME_REGEX = /^[\w/\-._]+$/;
    const KEY_REGEX = /^[\w]+?/;
    const [region, bucket, key] = s3Variable.split(SEPARATOR);

    if (!REGION_REGEX.test(region) || !region) {
      throw new Error('Invalid Region provided');
    }

    if (!NAME_REGEX.test(bucket) || !NAME_REGEX) {
      throw new Error('Improper Bucket Name provided');
    }

    if (!KEY_REGEX.test(key) || !key) {
      throw new Error('Improper key provided');
    }
    const data: AWS.S3.GetObjectOutput = await this.fetchData(
      region,
      bucket,
      key
    );
    if (
      data.ContentType?.startsWith('text') ||
      data.ContentType === 'application/json'
    ) {
      // body is a buffer
      return data.Body?.toString() as string;
    }

    throw new Error('Uncompatible data type');
  }

  private async fetchData(
    region: string,
    Bucket: string,
    Key: string
  ): Promise<AWS.S3.GetObjectOutput> {
    const s3 = new AWS.S3({ region: region });

    return new Promise(function (success, reject) {
      s3.getObject({ Bucket, Key }, function (err, data) {
        if (err) {
          reject(err);
        } else {
          success(data);
        }
      });
    });
  }
}
