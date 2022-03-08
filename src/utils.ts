import chalk from 'chalk';
import fs from 'fs';
import { spawn } from 'child_process';
import AwsSecretsLoader from './loaders/AwsSecretsLoader'

export interface Options {
  stage?: string;
  command?: string;
  script?: string;
  path?: string;
}

export default class Utils {
  static LOADER_CREDENTIAL_KEYS = {
    'AWS': ['AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY']
  };

  /**
   * Executes a multi-command using shell.
   * @param command command to be executed
   * @returns arguments array to be passed to child process
   *
   * When multiple commands are chained together, we need to run
   * them in shell. However, the shell will be different for Windows
   * and Unix based systems. So we decide the shell command accordingly.
   */
  static getScriptArgs(script: string): string[] {
    let args: string[] = [];

    if (process.platform === 'win32') {
      args = ['cmd', '/C', script];
      return args;
    }
    // Figure out the shell in Unix
    const shells: string[] = [
      '/bash',
      '/dash',
      '/fish',
      '/zsh',
      '/ksh',
      '/csh',
      '/tcsh',
    ];
    args = ['sh', '-c', script];
    const envShell = process.env.SHELL as string;
    for (const shell of shells) {
      if (shell.endsWith(envShell)) {
        args[0] = envShell;
      }
    }
    return args;
  }

  /**
   * Log Error and Exit
   * @param message   message to be logged in case of error
   */
  static logErrorAndExit(message: string): void {
    console.log(chalk.red(`ERROR: ${message}`));
    process.exit(-1);
  }

  static validateInput(options: Options): boolean {
    if (options.path && options.path.trim()) {
      options.path = options.path.trim();
      if (!fs.existsSync(options.path)) {
        this.logErrorAndExit(`Config folder, ${options.path} does not exist`);
      }
    }
    if (options.script && options.command) {
      this.logErrorAndExit(
        'Cannot use both --script and --command at the same time'
      );
    }
    if (options.command && !options.command.trim()) {
      this.logErrorAndExit('Command cannot be empty');
    }
    if (options.script && !options.script.trim()) {
      this.logErrorAndExit('Script cannot be empty');
    }

    return true;
  }
  static runChildProcess(cmd: string, args: string[]): void {
    spawn(cmd, args, { stdio: 'inherit' });
  }

  static checkIfLoaderCredentialKey(key: string, value: string): string | null {
    if (Utils.LOADER_CREDENTIAL_KEYS['AWS'].includes(key)) {

      if (Utils.LOADER_CREDENTIAL_KEYS['AWS'].every((eachKey) => 'SF_' + eachKey in process.env)) {
        return null;
      }
      if (new AwsSecretsLoader().canResolve(value)) {
        return 'AWS';
      }
    }
    return null;
  }

  static loadLoaderCredentials(vars: Record<string, string>) {
    let service: keyof typeof Utils.LOADER_CREDENTIAL_KEYS;
    for (service in Utils.LOADER_CREDENTIAL_KEYS) {

      for (const currVar in vars) {
        if (Utils.LOADER_CREDENTIAL_KEYS[service].map(key => 'SF_' + key).includes(currVar)) {
          process.env[currVar] = vars[currVar];
        }
      }
    }
  }
}
