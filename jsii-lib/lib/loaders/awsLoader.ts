import Loader from "./index";
import os = require("os");
import path = require("path");
import { readFileSync } from "fs";

export default class AWSLoader implements Loader {
  private isVariableInINI(awsVariable: string): boolean | string {
    const awsDir = path.join(path.join(os.homedir(), ".aws"), "credentials");
    const paramsMatch = /^\s*([^=]+?)\s*=\s*(.*?)\s*$/
    let fileContents: string[] = readFileSync(awsDir, "utf-8").split(/\r\n|\r|\n/);
    for (const content of fileContents) {
      let match = content.match(paramsMatch);
      if (match && match[1] === awsVariable) {
        return match[2];
      }
    }
    return false;
  }
  public loadData(awsVariable: string): string {
    const awsValue = this.isVariableInINI(awsVariable);
    // check if awsValue is a string
    if (typeof awsValue === "string") {
      return awsValue;
    } else
    // if awsValue is false, check if it is a variable in the environment
    {
      if (process.env[awsVariable] !== undefined && process.env[awsVariable] !== "") {
        return process.env[awsVariable] as string;
      } else {
        throw new Error(`${awsVariable} is not defined in the environment`);
      }
    }
  }
}
