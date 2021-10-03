const os = require('os');
const path = require('path');
const { readFileSync } = require('fs');

export default class Loader {
  public loadData(key: string, path: string): any {
    key = key.toLowerCase();
    switch (key) {
      case 'env':
        return process.env[path];
      case 'aws':
        return this.loadAWSData(path);
      case 's3':
        return 'hello';
      case 'ssm':
        return '';
      default:
        return 'Hello';
    }
  }

  private loadAWSData(aws_variable: string): string {
    console.log(aws_variable);
    const awsDir = path.join(path.join(os.homedir(), '.aws'), 'credentials');

    let fileContents: string[] = readFileSync(awsDir, 'utf-8').split('\n');
    for (const content of fileContents) {
      if (content.startsWith(aws_variable)) {
        return content.split('=', 2)[1];
      }
    }

    const msg = `Cannot find any AWS CREDENTIAL named ${aws_variable}`;
    throw Error(msg);
  }
}
