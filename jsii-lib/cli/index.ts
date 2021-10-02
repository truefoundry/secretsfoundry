#!/usr/bin/env node

const figlet = require("figlet");
const chalk = require("chalk");
const { Command } = require("commander");
const { exec, spawn } = require("child_process");
const program = new Command();
console.log(
  chalk.red(figlet.textSync("secrets-foundry", { horizontalLayout: "full" }))
);

type Options = {
  command: string;
  stage: string;
};

program
  .version("0.1.0", "-V, --version", "output the current version")
  .requiredOption("-S, --stage <string>", "Staging Area to be used")
  .requiredOption("-C, --command <string>", "Command to run")
  .parse(process.argv);

const options: Options = program.opts();
require("dotenv-flow").config({
  node_env: options.stage,
});

const opts = {
  stdio: [process.stdin, process.stdout, process.stderr, "pipe", "pipe"], // one pipe for writing, one for reading
};
const child = spawn(
  options.command.split(" ")[0],
  options.command.split(" ").slice(1),
  opts
);

child.stdio[4].pipe(process.stdout);

// child.stdout.on("data", (data: any) => {
//   process.stdout.write(data);
// });

// child.stderr.on("data", (data: any) => {
//   process.stderr.write(data);
// });

// child.on("error", (error: any) => {
//   console.log(`error:${error}`);
// });

// child.on("close", (code: any) => {
//   console.log(`child process exited with code ${code}`);
// });
