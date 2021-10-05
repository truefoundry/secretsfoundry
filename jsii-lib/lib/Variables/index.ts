import {
  AWSLoader,
  EnvLoader,
  S3Loader,
  SecretsLoader,
  SSMLoader,
} from "./loaders";

export default class Variables {
  VARIABLES_MATCH = /\${[\w]+?:.+?}/g;
  public async populate(value: string) {
    const variables = this.VARIABLES_MATCH.exec(value);
    if (variables) {
      const varExp = variables[0].substring(2, variables[0].length - 1);
      const firstColonIndex = varExp.indexOf(":");
      const refKey = varExp.substr(0, firstColonIndex);
      const refValue = varExp.substr(firstColonIndex + 1);
      switch (refKey) {
        case "env":
          const envLoader = new EnvLoader();
          return envLoader.loadData(refValue);

        case "aws":
          const awsLoader = new AWSLoader();
          return awsLoader.loadData(refValue);

        case "ssm":
          const ssmLoader = new SSMLoader();
          return await ssmLoader.loadData(refValue);

        case "sec":
          const secretLoader = new SecretsLoader();
          return await secretLoader.loadData(refValue);

        case "s3":
          const s3Loader = new S3Loader();
          return await s3Loader.loadData(refValue);

        default:
          return "hello";
      }
    }

    // a default return for no variable
    return "";
  }
}
