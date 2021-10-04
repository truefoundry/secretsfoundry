import BaseLoader, { SEPARATOR } from ".";

const AWS = require("aws-sdk");
const Buffer = require("buffer");

export default class SecretsLoader implements BaseLoader {
  public async loadData(secrets_variable: string): Promise<string> {
    const REGION_REGEX =
      /^(us(-gov)?|ap|ca|cn|eu|sa)-(central|(north|south)?(east|west)?)-\d?/;
    const NAME_REGEX = /^[\w\-]+$/;
    const [region, secretName] = secrets_variable.split(SEPARATOR);

    if (!REGION_REGEX.test(region)) {
      throw new Error("Invalid Region provided");
    }
    if (!NAME_REGEX.test(secretName)) {
      throw new Error("Improper Name provided");
    }
    try {
      const data: { [key: string]: string } = await this.fetchData(
        region,
        secretName
      );
      if ("SecretString" in data) {
        return data.SecretString;
      } else {
        const buff = new Buffer(data.SecretBinary, "base64");
        return buff.toString("ascii");
      }
    } catch (error) {
      //@ts-ignore
      throw new Error(`${error.code}: ${error.message}`);
    }
  }

  private async fetchData(region: string, secretName: string): Promise<any> {
    const client = new AWS.SecretsManager({
      region: region,
    });

    return new Promise(function (success, reject) {
      client.getSecretValue(
        { SecretId: secretName },
        function (err: any, data: { [key: string]: string }) {
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
