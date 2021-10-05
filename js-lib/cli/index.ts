#!/usr/bin/env node

const figlet = require("figlet");
const chalk = require("chalk");
const { Command } = require("commander");
const commander = require("commander");
const { spawn } = require("child_process");
const program = new Command();

/**
 * Checks for the condition, if true logs error.
 * @param condition condition to be checked
 * @param message   message to be logged in case of error
 */
const errorHandler = (condition: boolean, message: string): void => {
  if (condition) {
    errorLogger(message);
    process.exit();
  }
};

/**
 * Logs error to console.
 *
 * @param message message to be logged
 */
const errorLogger = (message: string): void => {
  console.log(chalk.red(`ERROR: ${message}`));
};

/**
 * Spawns a child process.
 * @param args arguments to the child process
 * @param opts options for child process
 */
const spawnChild = (
  args: string[],
  opts: {
    [key: string]: (
      | string
      | (NodeJS.WriteStream & { fd: 1 })
      | (NodeJS.ReadStream & { fd: 0 })
      | (NodeJS.WriteStream & { fd: 2 })
    )[];
  }
) => {
  const child = spawn(args[0], args.splice(1), opts);

  child.stdio[4].pipe(process.stdout);
};

/**
 * Executes a multi-command using shell.
 * @param command command to be executed
 * @returns arguments array to be passed to child process
 */
const handleCommandInput = (command: string): string[] => {
  errorHandler(!command.trim(), "Empty command passed");

  let args: string[] = [];

  if (process.platform === "win32") {
    args = ["cmd", "/C", command];
  } else {
    const shells: string[] = [
      "/bash",
      "/dash",
      "/fish",
      "/zsh",
      "/ksh",
      "/csh",
      "/tcsh",
    ];
    args = ["sh", "-c", command];
    const envShell = process.env.SHELL as string;
    for (const shell of shells) {
      if (shell.endsWith(envShell)) {
        args[0] = envShell;
      }
    }
  }

  return args;
};

/**
 * Executes a script(single-command).
 * @param script script to be executed
 * @returns arguments array to be passed to child process
 */
const handleScriptInput = (script: string): string[] => {
  errorHandler(!script.trim(), "Empty script passed");
  return [...script.split(" ")];
};

console.log(
  chalk.red(figlet.textSync("secrets-foundry", { horizontalLayout: "full" }))
);

interface Options {
  stage: string;
  command?: string;
  script?: string;
}

program
  .version("0.1.0", "-V, --version", "output the current version")
  .command("run")
  .requiredOption("--stage <string>", "Staging Area to be used")
  .option("-S, --script <string>", "Single command to run")
  .option("-C, --command <string>", "Multiple Commands to run")
  .description("Runs a process injecting the environment variables")
  .action((options: Options) => {
    errorHandler(
      !options.stage.trim(),
      "Missing stage option. Empty string passed"
    );
    errorHandler(
      !options.script && !options.command,
      "Either --script or --command is required, but none was found"
    );

    errorHandler(
      !!(options.script && options.command),
      "Cannot use both --script and --command at the same time"
    );

    let args: string[] = [];

    if (options.command) {
      args = handleCommandInput(options.command);
    } else if (options.script) {
      args = handleScriptInput(options.script);
    }

    // one pipe for reading and one for writing
    spawnChild(args, {
      stdio: [process.stdin, process.stdout, process.stderr, "pipe", "pipe"],
    });
  });

program.parse(process.argv);
