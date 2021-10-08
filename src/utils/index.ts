import chalk from 'chalk';
import fs from 'fs';

/**
 * Executes a multi-command using shell.
 * @param command command to be executed
 * @returns arguments array to be passed to child process
 *
 * When multiple commands are chained together, we need to run
 * them in shell. However, the shell will be different for Windows
 * and Unix based systems. So we decide the shell command accordingly.
 */
export const getScriptArgs = (script: string): string[] => {
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
};

/**
 * Log Error and Exit
 * @param message   message to be logged in case of error
 */
const logErrorAndExit = function (message: string): void {
  console.log(chalk.red(`ERROR: ${message}`));
  process.exit();
};

export const validateInput = function (options: Options): boolean {
  if (options.path && options.path.trim()) {
    options.path = options.path.trim();
    if (!fs.existsSync(options.path)) {
      logErrorAndExit(`Config folder, ${options.path} does not exist`);
    }
  }
  if (options.script && options.command) {
    logErrorAndExit('Cannot use both --script and --command at the same time');
  }
  if (options.command && !options.command.trim()) {
    logErrorAndExit('Command cannot be empty');
  }
  if (options.script && !options.script.trim()) {
    logErrorAndExit('Script cannot be empty');
  }

  return true;
};

export interface Options {
  stage?: string;
  command?: string;
  script?: string;
  path?: string;
}
