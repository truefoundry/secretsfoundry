import Loader, { SEPARATOR } from '.';
import AWS = require('aws-sdk');

export default class S3Loader implements Loader {
  public async loadData(s3Variable: string): Promise<string> {
    const REGION_REGEX =
      /^(us(-gov)?|ap|ca|cn|eu|sa)-(central|(north|south)?(east|west)?)-\d?/;
    const NAME_REGEX = /^[\w\/\-._]+$/;
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
    try {
      const data: { [key: string]: string } = await this.fetchData(
        region,
        bucket,
        key
      );
      if (
        data.ContentType.startsWith('text') ||
        data.ContentType === 'application/json'
      ) {
        // body is a buffer
        return data.Body.toString();
      }

      throw new Error('Uncompatible data type');
    } catch (error) {
      //@ts-ignore
      throw new Error(`${error.code}: ${error.message}`);
    }
  }

  private async fetchData(
    region: string,
    Bucket: string,
    Key: string
  ): Promise<any> {
    const s3 = new AWS.S3({ region: region });

    return new Promise(function (success, reject) {
      s3.getObject({ Bucket, Key }, function (err: any, data: any) {
        if (err) {
          reject(err);
        } else {
          success(data);
        }
      });
    });
  }
}
