import { AWSLoader, EnvLoader, SecretsLoader } from "./loaders";

export default class Variables {
  VARIABLES_MATCH = /\${[\w]+?:.+?}/g;
  public async populate(value: string) {
    const variables = this.VARIABLES_MATCH.exec(value);
    if (variables) {
      const varExp = variables[0].substring(2, variables[0].length - 1);
      const [refKey, refValue] = varExp.split(":", 2);
      switch (refKey) {
        case "env":
          const envLoader = new EnvLoader();
          return envLoader.loadData(refValue);

        case "aws":
          const awsLoader = new AWSLoader();
          return awsLoader.loadData(refValue);

        case "s3":
          return "hello";

        case "ssm":
          const secretLoader = new SecretsLoader();
          return await secretLoader.loadData(refValue);

        default:
          return "hello";
      }
    }

    // a default return for no variable
    return "";
  }
}
