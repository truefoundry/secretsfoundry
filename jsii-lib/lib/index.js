"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecretsFoundry = exports.parse = void 0;
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const fs = require("fs");
const loader_1 = require("./loader");
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
                    val = new loader_1.default().loadData(refKey, refValue);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLHlCQUEwQjtBQUMxQixxQ0FBOEI7QUFFOUIsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDO0FBQ3JCLE1BQU0sY0FBYyxHQUFHLCtCQUErQixDQUFDO0FBQ3ZELE1BQU0sV0FBVyxHQUFHLE1BQU0sQ0FBQztBQUMzQixNQUFNLGNBQWMsR0FBRyxZQUFZLENBQUM7QUFDcEMsTUFBTSxlQUFlLEdBQUcsaUJBQWlCLENBQUM7QUFFMUMsU0FBZ0IsS0FBSyxDQUFDLFdBQXdCO0lBQzVDLElBQUksR0FBRyxHQUE4QixFQUFFLENBQUM7SUFFeEMsNkRBQTZEO0lBQzdELFdBQVc7U0FDUixRQUFRLEVBQUU7U0FDVixLQUFLLENBQUMsY0FBYyxDQUFDO1NBQ3JCLE9BQU8sQ0FBQyxVQUFVLElBQUksRUFBRSxHQUFHO1FBQzFCLHdDQUF3QztRQUN4QyxNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQy9DLElBQUksV0FBVyxJQUFJLElBQUksRUFBRTtZQUN2QixNQUFNLEdBQUcsR0FBRyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDM0Isc0RBQXNEO1lBQ3RELElBQUksR0FBRyxHQUFHLFdBQVcsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDL0IsTUFBTSxHQUFHLEdBQUcsR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7WUFDM0IsTUFBTSxjQUFjLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLEtBQUssR0FBRyxDQUFDO1lBQzFELE1BQU0sY0FBYyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEdBQUcsQ0FBQztZQUMxRCxJQUFJLFNBQVMsQ0FBQztZQUNkLEdBQUc7Z0JBQ0QsU0FBUyxHQUFHLGVBQWUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ3RDLElBQUksU0FBUyxFQUFFO29CQUNiLCtDQUErQztvQkFDL0MsTUFBTSxNQUFNLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztvQkFDbEUsTUFBTSxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztvQkFDaEQsR0FBRyxHQUFHLElBQUksZ0JBQU0sRUFBRSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQUM7aUJBQy9DO2FBQ0YsUUFBUSxTQUFTLEVBQUU7WUFFcEIsNENBQTRDO1lBQzVDLElBQUksY0FBYyxJQUFJLGNBQWMsRUFBRTtnQkFDcEMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO2dCQUU1QixvQ0FBb0M7Z0JBQ3BDLElBQUksY0FBYyxFQUFFO29CQUNsQixHQUFHLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsT0FBTyxDQUFDLENBQUM7aUJBQ3pDO2FBQ0Y7aUJBQU07Z0JBQ0wsZ0NBQWdDO2dCQUNoQyxHQUFHLEdBQUcsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO2FBQ2xCO1lBQ0QsbUNBQW1DO1lBQ25DLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUM7U0FDaEI7YUFBTTtZQUNMLE9BQU8sQ0FBQyxHQUFHLENBQ1QsaURBQWlELEdBQUcsR0FBRyxDQUFDLEtBQUssSUFBSSxFQUFFLENBQ3BFLENBQUM7U0FDSDtJQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0wsT0FBTyxHQUFHLENBQUM7QUFDYixDQUFDO0FBakRELHNCQWlEQzs7OztBQUNELE1BQWEsY0FBYzs7OztJQUNsQixRQUFRLENBQUMsUUFBZ0I7UUFDOUIsOERBQThEO1FBQzlELE9BQU8sS0FBSyxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDbEQsQ0FBQzs7QUFKSCx3Q0FLQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBmcyA9IHJlcXVpcmUoJ2ZzJyk7XG5pbXBvcnQgTG9hZGVyIGZyb20gJy4vbG9hZGVyJztcblxuY29uc3QgTkVXTElORSA9ICdcXG4nO1xuY29uc3QgUkVfSU5JX0tFWV9WQUwgPSAvXlxccyooW1xcdy4tXSspXFxzKj1cXHMqKC4qKT9cXHMqJC87XG5jb25zdCBSRV9ORVdMSU5FUyA9IC9cXFxcbi9nO1xuY29uc3QgTkVXTElORVNfTUFUQ0ggPSAvXFxyXFxufFxcbnxcXHIvO1xuY29uc3QgVkFSSUFCTEVTX01BVENIID0gL1xcJHtbXFx3XSs/Oi4rP30vZztcblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlKGlucHV0QnVmZmVyOiBmcy5QYXRoTGlrZSkge1xuICBsZXQgb2JqOiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9ID0ge307XG5cbiAgLy8gY29udmVydCBCdWZmZXJzIGJlZm9yZSBzcGxpdHRpbmcgaW50byBsaW5lcyBhbmQgcHJvY2Vzc2luZ1xuICBpbnB1dEJ1ZmZlclxuICAgIC50b1N0cmluZygpXG4gICAgLnNwbGl0KE5FV0xJTkVTX01BVENIKVxuICAgIC5mb3JFYWNoKGZ1bmN0aW9uIChsaW5lLCBpZHgpIHtcbiAgICAgIC8vIG1hdGNoaW5nIFwiS0VZJyBhbmQgJ1ZBTCcgaW4gJ0tFWT1WQUwnXG4gICAgICBjb25zdCBrZXlWYWx1ZUFyciA9IGxpbmUubWF0Y2goUkVfSU5JX0tFWV9WQUwpO1xuICAgICAgaWYgKGtleVZhbHVlQXJyICE9IG51bGwpIHtcbiAgICAgICAgY29uc3Qga2V5ID0ga2V5VmFsdWVBcnJbMV07XG4gICAgICAgIC8vIGRlZmF1bHQgdW5kZWZpbmVkIG9yIG1pc3NpbmcgdmFsdWVzIHRvIGVtcHR5IHN0cmluZ1xuICAgICAgICBsZXQgdmFsID0ga2V5VmFsdWVBcnJbMl0gfHwgJyc7XG4gICAgICAgIGNvbnN0IGVuZCA9IHZhbC5sZW5ndGggLSAxO1xuICAgICAgICBjb25zdCBpc0RvdWJsZVF1b3RlZCA9IHZhbFswXSA9PT0gJ1wiJyAmJiB2YWxbZW5kXSA9PT0gJ1wiJztcbiAgICAgICAgY29uc3QgaXNTaW5nbGVRdW90ZWQgPSB2YWxbMF0gPT09IFwiJ1wiICYmIHZhbFtlbmRdID09PSBcIidcIjtcbiAgICAgICAgbGV0IHZhcmlhYmxlcztcbiAgICAgICAgZG8ge1xuICAgICAgICAgIHZhcmlhYmxlcyA9IFZBUklBQkxFU19NQVRDSC5leGVjKHZhbCk7XG4gICAgICAgICAgaWYgKHZhcmlhYmxlcykge1xuICAgICAgICAgICAgLy8gYSB2YXJpYWJsZSB2YWx1ZSBsb29rcyBsaWtlICR7PGtleT46PHZhbHVlPn1cbiAgICAgICAgICAgIGNvbnN0IHZhckV4cCA9IHZhcmlhYmxlc1swXS5zdWJzdHJpbmcoMiwgdmFyaWFibGVzWzBdLmxlbmd0aCAtIDEpO1xuICAgICAgICAgICAgY29uc3QgW3JlZktleSwgcmVmVmFsdWVdID0gdmFyRXhwLnNwbGl0KCc6JywgMik7XG4gICAgICAgICAgICB2YWwgPSBuZXcgTG9hZGVyKCkubG9hZERhdGEocmVmS2V5LCByZWZWYWx1ZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9IHdoaWxlICh2YXJpYWJsZXMpO1xuXG4gICAgICAgIC8vIGlmIHNpbmdsZSBvciBkb3VibGUgcXVvdGVkLCByZW1vdmUgcXVvdGVzXG4gICAgICAgIGlmIChpc1NpbmdsZVF1b3RlZCB8fCBpc0RvdWJsZVF1b3RlZCkge1xuICAgICAgICAgIHZhbCA9IHZhbC5zdWJzdHJpbmcoMSwgZW5kKTtcblxuICAgICAgICAgIC8vIGlmIGRvdWJsZSBxdW90ZWQsIGV4cGFuZCBuZXdsaW5lc1xuICAgICAgICAgIGlmIChpc0RvdWJsZVF1b3RlZCkge1xuICAgICAgICAgICAgdmFsID0gdmFsLnJlcGxhY2UoUkVfTkVXTElORVMsIE5FV0xJTkUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyByZW1vdmUgc3Vycm91bmRpbmcgd2hpdGVzcGFjZVxuICAgICAgICAgIHZhbCA9IHZhbC50cmltKCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gYXNzaWduIHRoZSBrZXktdmFsdWUgcGFpciB0byBvYmpcbiAgICAgICAgb2JqW2tleV0gPSB2YWw7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmxvZyhcbiAgICAgICAgICBgZGlkIG5vdCBtYXRjaCBrZXkgYW5kIHZhbHVlIHdoZW4gcGFyc2luZyBsaW5lICR7aWR4ICsgMX06ICR7bGluZX1gXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfSk7XG4gIHJldHVybiBvYmo7XG59XG5leHBvcnQgY2xhc3MgU2VjcmV0c0ZvdW5kcnkge1xuICBwdWJsaWMgcmVhZEZpbGUoZmlsZVBhdGg6IHN0cmluZyk6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH0ge1xuICAgIC8vIHNwZWNpZnlpbmcgYW4gZW5jb2RpbmcgcmV0dXJucyBhIHN0cmluZyBpbnN0ZWFkIG9mIGEgYnVmZmVyXG4gICAgcmV0dXJuIHBhcnNlKGZzLnJlYWRGaWxlU3luYyhmaWxlUGF0aCwgJ3V0ZjgnKSk7XG4gIH1cbn1cbiJdfQ==