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


@click.group()
@click.version_option('0.1.0')
def secretsfoundry_cli():
    """Secretsfoundry CLI"""
    pass


@secretsfoundry_cli.command()
@click.option('--stage', type=click.STRING, help='Stage of the service', required=True)
@click.option('-c', '--command', 'user_command', type=click.STRING, help='Single command to run')
@click.option('-s', '--script', 'user_script', type=click.STRING, help='Multiple commands to run like cd ~/ && ls')
def run(stage, user_command, user_script):
    """Run the process in command/script after injecting the environment variables"""
    if not (user_command or user_script):
        raise Exception('Either --script or --command is required, but none is found')
    if user_command and user_script:
        raise Exception('Cannot use both --script and --command at the same time')
    if user_command:
        run_shell_command(command=shlex.split(user_command))
    else:
        run_shell_command(command=user_script, shell_mode=True)
