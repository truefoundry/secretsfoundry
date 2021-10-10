#!/usr/bin/env node
import { Command } from 'commander';
import { SecretsFoundry } from './SecretsFoundry';
import { Loaders } from './loaders';
import Utils, { Options } from './utils';

const program = new Command();
program
  .version('0.1.0', '-V, --version', 'output the current version')
  .command('run')
  .option('--stage <string>', 'Stage of the service', '')
  .option('-c, --command <string>', 'Single command to run')
  .option('-s, --script <string>', 'Multiple Commands to run like cd ~/ && ls')
  .option(
    '-p, --path <string>',
    'Path to the config directory, that holds the .env files. Defaults to current directory'
  )
  .description(
    'Run the process in command/script after injecting the environment variables'
  )
  .action(async (options: Options) => {
    Utils.validateInput(options);
    const secretsFoundry = new SecretsFoundry(Loaders);
    try {
      const result = await secretsFoundry.extractValues(
        options.stage,
        options.path
      );
      if (!options.command && !options.script) {
        // if the user doesn't provide a command or a script, we will just log the result from parsing
        // the .env file
        console.log(JSON.stringify(result, null, 2));
        return;
      }
      for (const key in result) {
        process.env[key] = result[key] as string;
      }
    } catch (err) {
      console.error('Error parsing config file: ', err);
      process.exit();
    }

    let args: string[] = [];
    if (options.command) {
      args = options.command.split(' ');
    } else if (options.script) {
      args = Utils.getScriptArgs(options.script);
    }
    Utils.runChildProcess(args[0], args.splice(1));
  });

program.parse(process.argv);
