#!/usr/bin/env node

const figlet = require('figlet');
const chalk = require('chalk');
const { Command } = require('commander');
const commander = require('commander');
const { spawn } = require('child_process');
const program = new Command();
console.log(
  chalk.red(figlet.textSync('secrets-foundry', { horizontalLayout: 'full' }))
);

interface Options {
  stage: string;
  command?: string;
  script?: string;
}

program
  .version('0.1.0', '-V, --version', 'output the current version')
  .command('run')
  .requiredOption('--stage <string>', 'Staging Area to be used')
  .option('-S, --script <string>', 'Single command to run')
  .option('-C, --command <string>', 'Multiple Commands to run')
  .description('Runs a process injecting the environment variables')
  .action((options: Options) => {
    if (!options.script) {
      console.error('ERROR: Missing stage option. Empty string passed');
      process.exit();
    }
    if (!options.script && !options.command) {
      console.error(
        'Either --script or --command is required, but none was found'
      );
    } else if (options.script && options.command) {
      [
        console.error(
          'Cannot use both --script and --command at the same time'
        ),
      ];
    } else {
      require('dotenv-flow').config({
        node_env: options.stage,
      });

      let args: string[] = [];

      if (options.command?.length) {
        if (process.platform === 'win32') {
          args = ['cmd', '/C', options.command];
        } else {
          const shells: string[] = [
            '/bash',
            '/dash',
            '/fish',
            '/zsh',
            '/ksh',
            '/csh',
            '/tcsh',
          ];
          args = ['sh', '-c', options.command];
          const envShell = process.env.SHELL as string;
          for (const shell of shells) {
            if (shell.endsWith(envShell)) {
              args[0] = envShell;
            }
          }
        }
      } else {
        if (!options.script || !options.script.length) {
          console.error('No Script found to execute.');
          process.exit();
        }
        args = [...options.script?.split(' ')];
      }

      const opts = {
        stdio: [process.stdin, process.stdout, process.stderr, 'pipe', 'pipe'], // one pipe for writing, one for reading
      };
      const child = spawn(args[0], args.splice(1), opts);

      child.stdio[4].pipe(process.stdout);
    }
  });

program.parse(process.argv);
