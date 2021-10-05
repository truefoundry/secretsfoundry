#!/usr/bin/python
import os
import shlex
import subprocess

import click


def run_shell_command(command, cwd=os.getcwd(), env=None, shell_mode=False):
    proc = subprocess.Popen(
        command,
        shell=shell_mode,
        cwd=cwd,
        env=env,
    )
    proc.communicate()


# TODO(tharun634): uncomment this line, once cli goes into the python package
# @click.version_option(__version__)
@click.group()
def secretsfoundry_cli():
    click.secho('secretsfoundry CLI', bold=True, fg='green')


@secretsfoundry_cli.command(
    help='load the corresponding staging .env file and run your command/script'
)
@click.option('--stage', type=click.STRING, help='Staging area to be used to run the command(s)', required=True)
@click.option('-c', '--command', 'user_command', type=click.STRING, help='Single command to run')
@click.option('-s', '--script', 'user_script', type=click.STRING, help='Multiple commands to run')
def run(stage, user_command, user_script):
    if not (user_command or user_script):
        raise Exception('Either --script or --command is required, but none is found')
    print('Selected stage: ', stage)
    if user_command:
        run_shell_command(command=shlex.split(user_command))
    else:
        run_shell_command(command=user_script, shell_mode=True)


if __name__ == '__main__':
    secretsfoundry_cli()
