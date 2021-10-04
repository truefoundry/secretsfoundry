"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecretsFoundry = exports.parse = void 0;
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const fs = require("fs");
const loaders_1 = require("./loaders");
const NEWLINE = '\n';
const RE_INI_KEY_VAL = /^\s*([\w.-]+)\s*=\s*(.*)?\s*$/;
const RE_NEWLINES = /\\n/g;
const NEWLINES_MATCH = /\r\n|\n|\r/;
const VARIABLES_MATCH = /\${[\w]+?:.+?}/g;
function parse(inputBuffer) {
    let obj = {};
    // convert Buffers before splitting into lines and processing
    inputBuffer
        .toString()
        .split(NEWLINES_MATCH)
        .forEach(function (line, idx) {
        // matching "KEY' and 'VAL' in 'KEY=VAL'
        const keyValueArr = line.match(RE_INI_KEY_VAL);
        if (keyValueArr != null) {
            const key = keyValueArr[1];
            // default undefined or missing values to empty string
            let val = keyValueArr[2] || '';
            const end = val.length - 1;
            const isDoubleQuoted = val[0] === '"' && val[end] === '"';
            const isSingleQuoted = val[0] === "'" && val[end] === "'";
            let variables;
            do {
                variables = VARIABLES_MATCH.exec(val);
                if (variables) {
                    // a variable value looks like ${<key>:<value>}
                    const varExp = variables[0].substring(2, variables[0].length - 1);
                    const [refKey, refValue] = varExp.split(':', 2);
                    switch (refKey) {
                        case 'env':
                            val = new loaders_1.EnvLoader().loadData(refValue);
                            break;
                        case 'aws':
                            val = new loaders_1.AWSLoader().loadData(refValue);
                            break;
                        case 's3':
                            val = 'hello';
                            break;
                        case 'ssm':
                            val = 'hello';
                            break;
                        default:
                            val = 'hello';
                            break;
                    }
                }
            } while (variables);
            // if single or double quoted, remove quotes
            if (isSingleQuoted || isDoubleQuoted) {
                val = val.substring(1, end);
                // if double quoted, expand newlines
                if (isDoubleQuoted) {
                    val = val.replace(RE_NEWLINES, NEWLINE);
                }
            }
            else {
                // remove surrounding whitespace
                val = val.trim();
            }
            // assign the key-value pair to obj
            obj[key] = val;
        }
        else {
            console.log(`did not match key and value when parsing line ${idx + 1}: ${line}`);
        }
    });
    return obj;
}
exports.parse = parse;
/**
 * @stability stable
 */
class SecretsFoundry {
    /**
     * @stability stable
     */
    readFile(filePath) {
        // specifying an encoding returns a string instead of a buffer
        return parse(fs.readFileSync(filePath, 'utf8'));
    }
}
exports.SecretsFoundry = SecretsFoundry;
_a = JSII_RTTI_SYMBOL_1;
SecretsFoundry[_a] = { fqn: "secretsfoundry.SecretsFoundry", version: "1.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLHlCQUEwQjtBQUMxQix1Q0FBaUQ7QUFFakQsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDO0FBQ3JCLE1BQU0sY0FBYyxHQUFHLCtCQUErQixDQUFDO0FBQ3ZELE1BQU0sV0FBVyxHQUFHLE1BQU0sQ0FBQztBQUMzQixNQUFNLGNBQWMsR0FBRyxZQUFZLENBQUM7QUFDcEMsTUFBTSxlQUFlLEdBQUcsaUJBQWlCLENBQUM7QUFFMUMsU0FBZ0IsS0FBSyxDQUFDLFdBQXdCO0lBQzVDLElBQUksR0FBRyxHQUE4QixFQUFFLENBQUM7SUFFeEMsNkRBQTZEO0lBQzdELFdBQVc7U0FDUixRQUFRLEVBQUU7U0FDVixLQUFLLENBQUMsY0FBYyxDQUFDO1NBQ3JCLE9BQU8sQ0FBQyxVQUFVLElBQUksRUFBRSxHQUFHO1FBQzFCLHdDQUF3QztRQUN4QyxNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQy9DLElBQUksV0FBVyxJQUFJLElBQUksRUFBRTtZQUN2QixNQUFNLEdBQUcsR0FBRyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDM0Isc0RBQXNEO1lBQ3RELElBQUksR0FBRyxHQUFHLFdBQVcsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDL0IsTUFBTSxHQUFHLEdBQUcsR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7WUFDM0IsTUFBTSxjQUFjLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLEtBQUssR0FBRyxDQUFDO1lBQzFELE1BQU0sY0FBYyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEdBQUcsQ0FBQztZQUMxRCxJQUFJLFNBQVMsQ0FBQztZQUNkLEdBQUc7Z0JBQ0QsU0FBUyxHQUFHLGVBQWUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ3RDLElBQUksU0FBUyxFQUFFO29CQUNiLCtDQUErQztvQkFDL0MsTUFBTSxNQUFNLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztvQkFDbEUsTUFBTSxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztvQkFDaEQsUUFBUSxNQUFNLEVBQUU7d0JBQ2QsS0FBSyxLQUFLOzRCQUNSLEdBQUcsR0FBRyxJQUFJLG1CQUFTLEVBQUUsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUM7NEJBQ3pDLE1BQU07d0JBQ1IsS0FBSyxLQUFLOzRCQUNSLEdBQUcsR0FBRyxJQUFJLG1CQUFTLEVBQUUsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUM7NEJBQ3pDLE1BQU07d0JBQ1IsS0FBSyxJQUFJOzRCQUNQLEdBQUcsR0FBRyxPQUFPLENBQUM7NEJBQ2QsTUFBTTt3QkFDUixLQUFLLEtBQUs7NEJBQ1IsR0FBRyxHQUFHLE9BQU8sQ0FBQzs0QkFDZCxNQUFNO3dCQUNSOzRCQUNFLEdBQUcsR0FBRyxPQUFPLENBQUM7NEJBQ2QsTUFBTTtxQkFDVDtpQkFDRjthQUNGLFFBQVEsU0FBUyxFQUFFO1lBRXBCLDRDQUE0QztZQUM1QyxJQUFJLGNBQWMsSUFBSSxjQUFjLEVBQUU7Z0JBQ3BDLEdBQUcsR0FBRyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztnQkFFNUIsb0NBQW9DO2dCQUNwQyxJQUFJLGNBQWMsRUFBRTtvQkFDbEIsR0FBRyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLE9BQU8sQ0FBQyxDQUFDO2lCQUN6QzthQUNGO2lCQUFNO2dCQUNMLGdDQUFnQztnQkFDaEMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQzthQUNsQjtZQUNELG1DQUFtQztZQUNuQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDO1NBQ2hCO2FBQU07WUFDTCxPQUFPLENBQUMsR0FBRyxDQUNULGlEQUFpRCxHQUFHLEdBQUcsQ0FBQyxLQUFLLElBQUksRUFBRSxDQUNwRSxDQUFDO1NBQ0g7SUFDSCxDQUFDLENBQUMsQ0FBQztJQUNMLE9BQU8sR0FBRyxDQUFDO0FBQ2IsQ0FBQztBQWpFRCxzQkFpRUM7Ozs7QUFDRCxNQUFhLGNBQWM7Ozs7SUFDbEIsUUFBUSxDQUFDLFFBQWdCO1FBQzlCLDhEQUE4RDtRQUM5RCxPQUFPLEtBQUssQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDO0lBQ2xELENBQUM7O0FBSkgsd0NBS0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZnMgPSByZXF1aXJlKCdmcycpO1xuaW1wb3J0IHsgQVdTTG9hZGVyLCBFbnZMb2FkZXIgfSBmcm9tICcuL2xvYWRlcnMnO1xuXG5jb25zdCBORVdMSU5FID0gJ1xcbic7XG5jb25zdCBSRV9JTklfS0VZX1ZBTCA9IC9eXFxzKihbXFx3Li1dKylcXHMqPVxccyooLiopP1xccyokLztcbmNvbnN0IFJFX05FV0xJTkVTID0gL1xcXFxuL2c7XG5jb25zdCBORVdMSU5FU19NQVRDSCA9IC9cXHJcXG58XFxufFxcci87XG5jb25zdCBWQVJJQUJMRVNfTUFUQ0ggPSAvXFwke1tcXHddKz86Lis/fS9nO1xuXG5leHBvcnQgZnVuY3Rpb24gcGFyc2UoaW5wdXRCdWZmZXI6IGZzLlBhdGhMaWtlKSB7XG4gIGxldCBvYmo6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH0gPSB7fTtcblxuICAvLyBjb252ZXJ0IEJ1ZmZlcnMgYmVmb3JlIHNwbGl0dGluZyBpbnRvIGxpbmVzIGFuZCBwcm9jZXNzaW5nXG4gIGlucHV0QnVmZmVyXG4gICAgLnRvU3RyaW5nKClcbiAgICAuc3BsaXQoTkVXTElORVNfTUFUQ0gpXG4gICAgLmZvckVhY2goZnVuY3Rpb24gKGxpbmUsIGlkeCkge1xuICAgICAgLy8gbWF0Y2hpbmcgXCJLRVknIGFuZCAnVkFMJyBpbiAnS0VZPVZBTCdcbiAgICAgIGNvbnN0IGtleVZhbHVlQXJyID0gbGluZS5tYXRjaChSRV9JTklfS0VZX1ZBTCk7XG4gICAgICBpZiAoa2V5VmFsdWVBcnIgIT0gbnVsbCkge1xuICAgICAgICBjb25zdCBrZXkgPSBrZXlWYWx1ZUFyclsxXTtcbiAgICAgICAgLy8gZGVmYXVsdCB1bmRlZmluZWQgb3IgbWlzc2luZyB2YWx1ZXMgdG8gZW1wdHkgc3RyaW5nXG4gICAgICAgIGxldCB2YWwgPSBrZXlWYWx1ZUFyclsyXSB8fCAnJztcbiAgICAgICAgY29uc3QgZW5kID0gdmFsLmxlbmd0aCAtIDE7XG4gICAgICAgIGNvbnN0IGlzRG91YmxlUXVvdGVkID0gdmFsWzBdID09PSAnXCInICYmIHZhbFtlbmRdID09PSAnXCInO1xuICAgICAgICBjb25zdCBpc1NpbmdsZVF1b3RlZCA9IHZhbFswXSA9PT0gXCInXCIgJiYgdmFsW2VuZF0gPT09IFwiJ1wiO1xuICAgICAgICBsZXQgdmFyaWFibGVzO1xuICAgICAgICBkbyB7XG4gICAgICAgICAgdmFyaWFibGVzID0gVkFSSUFCTEVTX01BVENILmV4ZWModmFsKTtcbiAgICAgICAgICBpZiAodmFyaWFibGVzKSB7XG4gICAgICAgICAgICAvLyBhIHZhcmlhYmxlIHZhbHVlIGxvb2tzIGxpa2UgJHs8a2V5Pjo8dmFsdWU+fVxuICAgICAgICAgICAgY29uc3QgdmFyRXhwID0gdmFyaWFibGVzWzBdLnN1YnN0cmluZygyLCB2YXJpYWJsZXNbMF0ubGVuZ3RoIC0gMSk7XG4gICAgICAgICAgICBjb25zdCBbcmVmS2V5LCByZWZWYWx1ZV0gPSB2YXJFeHAuc3BsaXQoJzonLCAyKTtcbiAgICAgICAgICAgIHN3aXRjaCAocmVmS2V5KSB7XG4gICAgICAgICAgICAgIGNhc2UgJ2Vudic6XG4gICAgICAgICAgICAgICAgdmFsID0gbmV3IEVudkxvYWRlcigpLmxvYWREYXRhKHJlZlZhbHVlKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgY2FzZSAnYXdzJzpcbiAgICAgICAgICAgICAgICB2YWwgPSBuZXcgQVdTTG9hZGVyKCkubG9hZERhdGEocmVmVmFsdWUpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICBjYXNlICdzMyc6XG4gICAgICAgICAgICAgICAgdmFsID0gJ2hlbGxvJztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgY2FzZSAnc3NtJzpcbiAgICAgICAgICAgICAgICB2YWwgPSAnaGVsbG8nO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHZhbCA9ICdoZWxsbyc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IHdoaWxlICh2YXJpYWJsZXMpO1xuXG4gICAgICAgIC8vIGlmIHNpbmdsZSBvciBkb3VibGUgcXVvdGVkLCByZW1vdmUgcXVvdGVzXG4gICAgICAgIGlmIChpc1NpbmdsZVF1b3RlZCB8fCBpc0RvdWJsZVF1b3RlZCkge1xuICAgICAgICAgIHZhbCA9IHZhbC5zdWJzdHJpbmcoMSwgZW5kKTtcblxuICAgICAgICAgIC8vIGlmIGRvdWJsZSBxdW90ZWQsIGV4cGFuZCBuZXdsaW5lc1xuICAgICAgICAgIGlmIChpc0RvdWJsZVF1b3RlZCkge1xuICAgICAgICAgICAgdmFsID0gdmFsLnJlcGxhY2UoUkVfTkVXTElORVMsIE5FV0xJTkUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyByZW1vdmUgc3Vycm91bmRpbmcgd2hpdGVzcGFjZVxuICAgICAgICAgIHZhbCA9IHZhbC50cmltKCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gYXNzaWduIHRoZSBrZXktdmFsdWUgcGFpciB0byBvYmpcbiAgICAgICAgb2JqW2tleV0gPSB2YWw7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmxvZyhcbiAgICAgICAgICBgZGlkIG5vdCBtYXRjaCBrZXkgYW5kIHZhbHVlIHdoZW4gcGFyc2luZyBsaW5lICR7aWR4ICsgMX06ICR7bGluZX1gXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfSk7XG4gIHJldHVybiBvYmo7XG59XG5leHBvcnQgY2xhc3MgU2VjcmV0c0ZvdW5kcnkge1xuICBwdWJsaWMgcmVhZEZpbGUoZmlsZVBhdGg6IHN0cmluZyk6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH0ge1xuICAgIC8vIHNwZWNpZnlpbmcgYW4gZW5jb2RpbmcgcmV0dXJucyBhIHN0cmluZyBpbnN0ZWFkIG9mIGEgYnVmZmVyXG4gICAgcmV0dXJuIHBhcnNlKGZzLnJlYWRGaWxlU3luYyhmaWxlUGF0aCwgJ3V0ZjgnKSk7XG4gIH1cbn1cbiJdfQ==