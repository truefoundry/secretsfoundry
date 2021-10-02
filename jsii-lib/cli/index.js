#!/usr/bin/env node
"use strict";
const figlet = require('figlet');
const chalk = require('chalk');
const { Command } = require('commander');
const commander = require('commander');
const { spawn } = require('child_process');
const program = new Command();
console.log(chalk.red(figlet.textSync('secrets-foundry', { horizontalLayout: 'full' })));
program
    .version('0.1.0', '-V, --version', 'output the current version')
    .command('run')
    .requiredOption('--stage <string>', 'Staging Area to be used')
    .option('-S, --script <string>', 'Single command to run')
    .option('-C, --command <string>', 'Multiple Commands to run')
    .description('Runs a process injecting the environment variables')
    .action((options) => {
    var _a, _b;
    if (!options.script) {
        console.error('ERROR: Missing stage option. Empty string passed');
        process.exit();
    }
    if (!options.script && !options.command) {
        console.error('Either --script or --command is required, but none was found');
    }
    else if (options.script && options.command) {
        [
            console.error('Cannot use both --script and --command at the same time'),
        ];
    }
    else {
        require('dotenv-flow').config({
            node_env: options.stage,
        });
        let args = [];
        if ((_a = options.command) === null || _a === void 0 ? void 0 : _a.length) {
            if (process.platform === 'win32') {
                args = ['cmd', '/C', options.command];
            }
            else {
                const shells = [
                    '/bash',
                    '/dash',
                    '/fish',
                    '/zsh',
                    '/ksh',
                    '/csh',
                    '/tcsh',
                ];
                args = ['sh', '-c', options.command];
                const envShell = process.env.SHELL;
                for (const shell of shells) {
                    if (shell.endsWith(envShell)) {
                        args[0] = envShell;
                    }
                }
            }
        }
        else {
            if (!options.script || !options.script.length) {
                console.error('No Script found to execute.');
                process.exit();
            }
            args = [...(_b = options.script) === null || _b === void 0 ? void 0 : _b.split(' ')];
        }
        const opts = {
            stdio: [process.stdin, process.stdout, process.stderr, 'pipe', 'pipe'],
        };
        const child = spawn(args[0], args.splice(1), opts);
        child.stdio[4].pipe(process.stdout);
    }
});
program.parse(process.argv);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBLE1BQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUNqQyxNQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDL0IsTUFBTSxFQUFFLE9BQU8sRUFBRSxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUN6QyxNQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDdkMsTUFBTSxFQUFFLEtBQUssRUFBRSxHQUFHLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUMzQyxNQUFNLE9BQU8sR0FBRyxJQUFJLE9BQU8sRUFBRSxDQUFDO0FBQzlCLE9BQU8sQ0FBQyxHQUFHLENBQ1QsS0FBSyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLGlCQUFpQixFQUFFLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUM1RSxDQUFDO0FBUUYsT0FBTztLQUNKLE9BQU8sQ0FBQyxPQUFPLEVBQUUsZUFBZSxFQUFFLDRCQUE0QixDQUFDO0tBQy9ELE9BQU8sQ0FBQyxLQUFLLENBQUM7S0FDZCxjQUFjLENBQUMsa0JBQWtCLEVBQUUseUJBQXlCLENBQUM7S0FDN0QsTUFBTSxDQUFDLHVCQUF1QixFQUFFLHVCQUF1QixDQUFDO0tBQ3hELE1BQU0sQ0FBQyx3QkFBd0IsRUFBRSwwQkFBMEIsQ0FBQztLQUM1RCxXQUFXLENBQUMsb0RBQW9ELENBQUM7S0FDakUsTUFBTSxDQUFDLENBQUMsT0FBZ0IsRUFBRSxFQUFFOztJQUMzQixJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRTtRQUNuQixPQUFPLENBQUMsS0FBSyxDQUFDLGtEQUFrRCxDQUFDLENBQUM7UUFDbEUsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDO0tBQ2hCO0lBQ0QsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFO1FBQ3ZDLE9BQU8sQ0FBQyxLQUFLLENBQ1gsOERBQThELENBQy9ELENBQUM7S0FDSDtTQUFNLElBQUksT0FBTyxDQUFDLE1BQU0sSUFBSSxPQUFPLENBQUMsT0FBTyxFQUFFO1FBQzVDO1lBQ0UsT0FBTyxDQUFDLEtBQUssQ0FDWCx5REFBeUQsQ0FDMUQ7U0FDRixDQUFDO0tBQ0g7U0FBTTtRQUNMLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQyxNQUFNLENBQUM7WUFDNUIsUUFBUSxFQUFFLE9BQU8sQ0FBQyxLQUFLO1NBQ3hCLENBQUMsQ0FBQztRQUVILElBQUksSUFBSSxHQUFhLEVBQUUsQ0FBQztRQUV4QixVQUFJLE9BQU8sQ0FBQyxPQUFPLDBDQUFFLE1BQU0sRUFBRTtZQUMzQixJQUFJLE9BQU8sQ0FBQyxRQUFRLEtBQUssT0FBTyxFQUFFO2dCQUNoQyxJQUFJLEdBQUcsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQzthQUN2QztpQkFBTTtnQkFDTCxNQUFNLE1BQU0sR0FBYTtvQkFDdkIsT0FBTztvQkFDUCxPQUFPO29CQUNQLE9BQU87b0JBQ1AsTUFBTTtvQkFDTixNQUFNO29CQUNOLE1BQU07b0JBQ04sT0FBTztpQkFDUixDQUFDO2dCQUNGLElBQUksR0FBRyxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUNyQyxNQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQWUsQ0FBQztnQkFDN0MsS0FBSyxNQUFNLEtBQUssSUFBSSxNQUFNLEVBQUU7b0JBQzFCLElBQUksS0FBSyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsRUFBRTt3QkFDNUIsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLFFBQVEsQ0FBQztxQkFDcEI7aUJBQ0Y7YUFDRjtTQUNGO2FBQU07WUFDTCxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFO2dCQUM3QyxPQUFPLENBQUMsS0FBSyxDQUFDLDZCQUE2QixDQUFDLENBQUM7Z0JBQzdDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQzthQUNoQjtZQUNELElBQUksR0FBRyxDQUFDLFNBQUcsT0FBTyxDQUFDLE1BQU0sMENBQUUsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7U0FDeEM7UUFFRCxNQUFNLElBQUksR0FBRztZQUNYLEtBQUssRUFBRSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxNQUFNLENBQUM7U0FDdkUsQ0FBQztRQUNGLE1BQU0sS0FBSyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUVuRCxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7S0FDckM7QUFDSCxDQUFDLENBQUMsQ0FBQztBQUVMLE9BQU8sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiIyEvdXNyL2Jpbi9lbnYgbm9kZVxuXG5jb25zdCBmaWdsZXQgPSByZXF1aXJlKCdmaWdsZXQnKTtcbmNvbnN0IGNoYWxrID0gcmVxdWlyZSgnY2hhbGsnKTtcbmNvbnN0IHsgQ29tbWFuZCB9ID0gcmVxdWlyZSgnY29tbWFuZGVyJyk7XG5jb25zdCBjb21tYW5kZXIgPSByZXF1aXJlKCdjb21tYW5kZXInKTtcbmNvbnN0IHsgc3Bhd24gfSA9IHJlcXVpcmUoJ2NoaWxkX3Byb2Nlc3MnKTtcbmNvbnN0IHByb2dyYW0gPSBuZXcgQ29tbWFuZCgpO1xuY29uc29sZS5sb2coXG4gIGNoYWxrLnJlZChmaWdsZXQudGV4dFN5bmMoJ3NlY3JldHMtZm91bmRyeScsIHsgaG9yaXpvbnRhbExheW91dDogJ2Z1bGwnIH0pKVxuKTtcblxuaW50ZXJmYWNlIE9wdGlvbnMge1xuICBzdGFnZTogc3RyaW5nO1xuICBjb21tYW5kPzogc3RyaW5nO1xuICBzY3JpcHQ/OiBzdHJpbmc7XG59XG5cbnByb2dyYW1cbiAgLnZlcnNpb24oJzAuMS4wJywgJy1WLCAtLXZlcnNpb24nLCAnb3V0cHV0IHRoZSBjdXJyZW50IHZlcnNpb24nKVxuICAuY29tbWFuZCgncnVuJylcbiAgLnJlcXVpcmVkT3B0aW9uKCctLXN0YWdlIDxzdHJpbmc+JywgJ1N0YWdpbmcgQXJlYSB0byBiZSB1c2VkJylcbiAgLm9wdGlvbignLVMsIC0tc2NyaXB0IDxzdHJpbmc+JywgJ1NpbmdsZSBjb21tYW5kIHRvIHJ1bicpXG4gIC5vcHRpb24oJy1DLCAtLWNvbW1hbmQgPHN0cmluZz4nLCAnTXVsdGlwbGUgQ29tbWFuZHMgdG8gcnVuJylcbiAgLmRlc2NyaXB0aW9uKCdSdW5zIGEgcHJvY2VzcyBpbmplY3RpbmcgdGhlIGVudmlyb25tZW50IHZhcmlhYmxlcycpXG4gIC5hY3Rpb24oKG9wdGlvbnM6IE9wdGlvbnMpID0+IHtcbiAgICBpZiAoIW9wdGlvbnMuc2NyaXB0KSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdFUlJPUjogTWlzc2luZyBzdGFnZSBvcHRpb24uIEVtcHR5IHN0cmluZyBwYXNzZWQnKTtcbiAgICAgIHByb2Nlc3MuZXhpdCgpO1xuICAgIH1cbiAgICBpZiAoIW9wdGlvbnMuc2NyaXB0ICYmICFvcHRpb25zLmNvbW1hbmQpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXG4gICAgICAgICdFaXRoZXIgLS1zY3JpcHQgb3IgLS1jb21tYW5kIGlzIHJlcXVpcmVkLCBidXQgbm9uZSB3YXMgZm91bmQnXG4gICAgICApO1xuICAgIH0gZWxzZSBpZiAob3B0aW9ucy5zY3JpcHQgJiYgb3B0aW9ucy5jb21tYW5kKSB7XG4gICAgICBbXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXG4gICAgICAgICAgJ0Nhbm5vdCB1c2UgYm90aCAtLXNjcmlwdCBhbmQgLS1jb21tYW5kIGF0IHRoZSBzYW1lIHRpbWUnXG4gICAgICAgICksXG4gICAgICBdO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXF1aXJlKCdkb3RlbnYtZmxvdycpLmNvbmZpZyh7XG4gICAgICAgIG5vZGVfZW52OiBvcHRpb25zLnN0YWdlLFxuICAgICAgfSk7XG5cbiAgICAgIGxldCBhcmdzOiBzdHJpbmdbXSA9IFtdO1xuXG4gICAgICBpZiAob3B0aW9ucy5jb21tYW5kPy5sZW5ndGgpIHtcbiAgICAgICAgaWYgKHByb2Nlc3MucGxhdGZvcm0gPT09ICd3aW4zMicpIHtcbiAgICAgICAgICBhcmdzID0gWydjbWQnLCAnL0MnLCBvcHRpb25zLmNvbW1hbmRdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnN0IHNoZWxsczogc3RyaW5nW10gPSBbXG4gICAgICAgICAgICAnL2Jhc2gnLFxuICAgICAgICAgICAgJy9kYXNoJyxcbiAgICAgICAgICAgICcvZmlzaCcsXG4gICAgICAgICAgICAnL3pzaCcsXG4gICAgICAgICAgICAnL2tzaCcsXG4gICAgICAgICAgICAnL2NzaCcsXG4gICAgICAgICAgICAnL3Rjc2gnLFxuICAgICAgICAgIF07XG4gICAgICAgICAgYXJncyA9IFsnc2gnLCAnLWMnLCBvcHRpb25zLmNvbW1hbmRdO1xuICAgICAgICAgIGNvbnN0IGVudlNoZWxsID0gcHJvY2Vzcy5lbnYuU0hFTEwgYXMgc3RyaW5nO1xuICAgICAgICAgIGZvciAoY29uc3Qgc2hlbGwgb2Ygc2hlbGxzKSB7XG4gICAgICAgICAgICBpZiAoc2hlbGwuZW5kc1dpdGgoZW52U2hlbGwpKSB7XG4gICAgICAgICAgICAgIGFyZ3NbMF0gPSBlbnZTaGVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICghb3B0aW9ucy5zY3JpcHQgfHwgIW9wdGlvbnMuc2NyaXB0Lmxlbmd0aCkge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ05vIFNjcmlwdCBmb3VuZCB0byBleGVjdXRlLicpO1xuICAgICAgICAgIHByb2Nlc3MuZXhpdCgpO1xuICAgICAgICB9XG4gICAgICAgIGFyZ3MgPSBbLi4ub3B0aW9ucy5zY3JpcHQ/LnNwbGl0KCcgJyldO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBvcHRzID0ge1xuICAgICAgICBzdGRpbzogW3Byb2Nlc3Muc3RkaW4sIHByb2Nlc3Muc3Rkb3V0LCBwcm9jZXNzLnN0ZGVyciwgJ3BpcGUnLCAncGlwZSddLCAvLyBvbmUgcGlwZSBmb3Igd3JpdGluZywgb25lIGZvciByZWFkaW5nXG4gICAgICB9O1xuICAgICAgY29uc3QgY2hpbGQgPSBzcGF3bihhcmdzWzBdLCBhcmdzLnNwbGljZSgxKSwgb3B0cyk7XG5cbiAgICAgIGNoaWxkLnN0ZGlvWzRdLnBpcGUocHJvY2Vzcy5zdGRvdXQpO1xuICAgIH1cbiAgfSk7XG5cbnByb2dyYW0ucGFyc2UocHJvY2Vzcy5hcmd2KTtcbiJdfQ==