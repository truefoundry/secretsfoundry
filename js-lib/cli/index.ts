#!/usr/bin/env node

const figlet = require("figlet");
const chalk = require("chalk");
const { Command } = require("commander");
const commander = require("commander");
const { spawn } = require("child_process");
const program = new Command();

const CUSTOM_STAGE_NAME = "STAGE_CHOSEN_USER";

const errorLogger = (message: string): void => {
  console.log(chalk.red(`ERROR: ${message}`));
};

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
    if (!options.stage.trim()) {
      errorLogger("Missing stage option. Empty string passed");
      process.exit();
    }
    if (!options.script && !options.command) {
      errorLogger(
        "Either --script or --command is required, but none was found"
      );
      process.exit();
    }
    if (options.script && options.command) {
      errorLogger("Cannot use both --script and --command at the same time");
      process.exit();
    }

    process.env[CUSTOM_STAGE_NAME] = options.stage;

    let args: string[] = [];

    if (options.command) {
      if (!options.command?.trim()) {
        errorLogger("Empty command passed");
        process.exit();
      }
      if (process.platform === "win32") {
        args = ["cmd", "/C", options.command];
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
        args = ["sh", "-c", options.command];
        const envShell = process.env.SHELL as string;
        for (const shell of shells) {
          if (shell.endsWith(envShell)) {
            args[0] = envShell;
          }
        }
      }
    } else {
      if (!options.script?.trim()) {
        errorLogger("Empty script passed");
        process.exit();
      }
      args = [...options.script?.split(" ")];
    }

    const opts = {
      stdio: [process.stdin, process.stdout, process.stderr, "pipe", "pipe"], // one pipe for writing, one for reading
    };
    spawnChild(args, opts);
  });

program.parse(process.argv);
