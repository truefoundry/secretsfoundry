#!/usr/bin/env node

const chalk = require("chalk");
const { Command } = require("commander");
const { spawn } = require("child_process");

interface Options {
  stage: string;
  command?: string;
  script?: string;
}

/**
 * Log Error and Exit
 * @param message   message to be logged in case of error
 */
function logErrorAndExit(message: string): void {
  console.log(chalk.red(`ERROR: ${message}`));
  process.exit();
}

function validateInput(options: Options): void {
  if (!options.stage.trim()) {
    logErrorAndExit("Missing stage option. Empty string passed");
  }

  if (!options.script && !options.command) {
    logErrorAndExit(
      "Either --script or --command is required, but none was found"
    );
  }

  if (options.script && options.command) {
    logErrorAndExit("Cannot use both --script and --command at the same time");
  }

  if (options.command && !options.command.trim()) {
    logErrorAndExit("Command cannot be empty");
  }

  if (options.script && !options.script.trim()) {
    logErrorAndExit("Script cannot be empty");
  }
}

function runChildProcess(cmd: String, args: String[]): void {
  spawn(cmd, args, { stdio: "inherit" });
}

/**
 * Executes a multi-command using shell.
 * @param command command to be executed
 * @returns arguments array to be passed to child process
 *
 * When multiple commands are chained together, we need to run
 * them in shell. However, the shell will be different for Windows
 * and Unix based systems. So we decide the shell command accordingly.
 */
const getScriptArgs = (script: string): string[] => {
  let args: string[] = [];

  if (process.platform === "win32") {
    args = ["cmd", "/C", script];
    return args;
  }
  // Figure out the shell in Unix
  const shells: string[] = [
    "/bash",
    "/dash",
    "/fish",
    "/zsh",
    "/ksh",
    "/csh",
    "/tcsh",
  ];
  args = ["sh", "-c", script];
  const envShell = process.env.SHELL as string;
  for (const shell of shells) {
    if (shell.endsWith(envShell)) {
      args[0] = envShell;
    }
  }
  return args;
};

const program = new Command();
program
  .version("0.1.0", "-V, --version", "output the current version")
  .command("run")
  .requiredOption("--stage <string>", "Stage of the service")
  .option("-c, --command <string>", "Single command to run")
  .option("-s, --script <string>", "Multiple Commands to run like cd ~/ && ls")
  .description(
    "Run the process in command/script after injecting the environment variables"
  )
  .action((options: Options) => {
    validateInput(options);

    let args: string[] = [];
    if (options.command) {
      args = options.command.split(" ");
    } else if (options.script) {
      args = getScriptArgs(options.script);
    }
    runChildProcess(args[0], args.splice(1));
  });

program.parse(process.argv);
