import { Loaders } from "./loaders";

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
        case Loaders.AWS.key:
          return await Loaders.AWS.loader.loadData(refValue);

        case Loaders.SSM.key:
          return await Loaders.SSM.loader.loadData(refValue);

        case Loaders.SECRET.key:
          return await Loaders.SECRET.loader.loadData(refValue);

        case Loaders.S3.key:
          return await Loaders.S3.loader.loadData(refValue);

        default:
          return "hello";
      }
    }

    // a default return for no variable
    return value;
  }
}
