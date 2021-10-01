"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecretsFoundry = exports.parse = void 0;
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const fs = require("fs");
const NEWLINE = '\n';
const RE_INI_KEY_VAL = /^\s*([\w.-]+)\s*=\s*(.*)?\s*$/;
const RE_NEWLINES = /\\n/g;
const NEWLINES_MATCH = /\r\n|\n|\r/;
function parse(inputBuffer) {
    let obj = {};
    // convert Buffers before splitting into lines and processing
    inputBuffer.toString().split(NEWLINES_MATCH).forEach(function (line, idx) {
        // matching "KEY' and 'VAL' in 'KEY=VAL'
        const keyValueArr = line.match(RE_INI_KEY_VAL);
        if (keyValueArr != null) {
            let key = keyValueArr[1];
            // default undefined or missing values to empty string
            let val = (keyValueArr[2] || '');
            let end = val.length - 1;
            let isDoubleQuoted = val[0] === '"' && val[end] === '"';
            let isSingleQuoted = val[0] === "'" && val[end] === "'";
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLHlCQUF5QjtBQUV6QixNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUE7QUFDcEIsTUFBTSxjQUFjLEdBQUcsK0JBQStCLENBQUE7QUFDdEQsTUFBTSxXQUFXLEdBQUcsTUFBTSxDQUFBO0FBQzFCLE1BQU0sY0FBYyxHQUFHLFlBQVksQ0FBQTtBQUNuQyxTQUFnQixLQUFLLENBQUMsV0FBd0I7SUFDMUMsSUFBSSxHQUFHLEdBQStCLEVBQUUsQ0FBQTtJQUV4Qyw2REFBNkQ7SUFDN0QsV0FBVyxDQUFDLFFBQVEsRUFBRSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxJQUFJLEVBQUUsR0FBRztRQUNwRSx3Q0FBd0M7UUFDeEMsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsQ0FBQTtRQUM5QyxJQUFJLFdBQVcsSUFBSSxJQUFJLEVBQUU7WUFDckIsSUFBSSxHQUFHLEdBQUcsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFBO1lBQ3hCLHNEQUFzRDtZQUN0RCxJQUFJLEdBQUcsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQTtZQUNoQyxJQUFJLEdBQUcsR0FBRyxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQTtZQUN4QixJQUFJLGNBQWMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsS0FBSyxHQUFHLENBQUE7WUFDdkQsSUFBSSxjQUFjLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLEtBQUssR0FBRyxDQUFBO1lBRXZELDRDQUE0QztZQUM1QyxJQUFJLGNBQWMsSUFBSSxjQUFjLEVBQUU7Z0JBQ2xDLEdBQUcsR0FBRyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQTtnQkFFM0Isb0NBQW9DO2dCQUNwQyxJQUFJLGNBQWMsRUFBRTtvQkFDaEIsR0FBRyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLE9BQU8sQ0FBQyxDQUFBO2lCQUMxQzthQUNKO2lCQUFNO2dCQUNILGdDQUFnQztnQkFDaEMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQTthQUNuQjtZQUNELEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUE7U0FDakI7YUFBTTtZQUNILE9BQU8sQ0FBQyxHQUFHLENBQUMsaURBQWlELEdBQUcsR0FBRyxDQUFDLEtBQUssSUFBSSxFQUFFLENBQUMsQ0FBQTtTQUNuRjtJQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ0gsT0FBTyxHQUFHLENBQUE7QUFDZCxDQUFDO0FBakNELHNCQWlDQzs7OztBQUNELE1BQWEsY0FBYzs7OztJQUNoQixRQUFRLENBQUMsUUFBZ0I7UUFDNUIsOERBQThEO1FBQzlELE9BQU8sS0FBSyxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUE7SUFDbkQsQ0FBQzs7QUFKTCx3Q0FLQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBmcyA9IHJlcXVpcmUoJ2ZzJylcclxuXHJcbmNvbnN0IE5FV0xJTkUgPSAnXFxuJ1xyXG5jb25zdCBSRV9JTklfS0VZX1ZBTCA9IC9eXFxzKihbXFx3Li1dKylcXHMqPVxccyooLiopP1xccyokL1xyXG5jb25zdCBSRV9ORVdMSU5FUyA9IC9cXFxcbi9nXHJcbmNvbnN0IE5FV0xJTkVTX01BVENIID0gL1xcclxcbnxcXG58XFxyL1xyXG5leHBvcnQgZnVuY3Rpb24gcGFyc2UoaW5wdXRCdWZmZXI6IGZzLlBhdGhMaWtlKSB7XHJcbiAgICBsZXQgb2JqOiB7IFtrZXk6IHN0cmluZ106IHN0cmluZzsgfSA9IHt9XHJcblxyXG4gICAgLy8gY29udmVydCBCdWZmZXJzIGJlZm9yZSBzcGxpdHRpbmcgaW50byBsaW5lcyBhbmQgcHJvY2Vzc2luZ1xyXG4gICAgaW5wdXRCdWZmZXIudG9TdHJpbmcoKS5zcGxpdChORVdMSU5FU19NQVRDSCkuZm9yRWFjaChmdW5jdGlvbiAobGluZSwgaWR4KSB7XHJcbiAgICAgICAgLy8gbWF0Y2hpbmcgXCJLRVknIGFuZCAnVkFMJyBpbiAnS0VZPVZBTCdcclxuICAgICAgICBjb25zdCBrZXlWYWx1ZUFyciA9IGxpbmUubWF0Y2goUkVfSU5JX0tFWV9WQUwpXHJcbiAgICAgICAgaWYgKGtleVZhbHVlQXJyICE9IG51bGwpIHtcclxuICAgICAgICAgICAgbGV0IGtleSA9IGtleVZhbHVlQXJyWzFdXHJcbiAgICAgICAgICAgIC8vIGRlZmF1bHQgdW5kZWZpbmVkIG9yIG1pc3NpbmcgdmFsdWVzIHRvIGVtcHR5IHN0cmluZ1xyXG4gICAgICAgICAgICBsZXQgdmFsID0gKGtleVZhbHVlQXJyWzJdIHx8ICcnKVxyXG4gICAgICAgICAgICBsZXQgZW5kID0gdmFsLmxlbmd0aCAtIDFcclxuICAgICAgICAgICAgbGV0IGlzRG91YmxlUXVvdGVkID0gdmFsWzBdID09PSAnXCInICYmIHZhbFtlbmRdID09PSAnXCInXHJcbiAgICAgICAgICAgIGxldCBpc1NpbmdsZVF1b3RlZCA9IHZhbFswXSA9PT0gXCInXCIgJiYgdmFsW2VuZF0gPT09IFwiJ1wiXHJcblxyXG4gICAgICAgICAgICAvLyBpZiBzaW5nbGUgb3IgZG91YmxlIHF1b3RlZCwgcmVtb3ZlIHF1b3Rlc1xyXG4gICAgICAgICAgICBpZiAoaXNTaW5nbGVRdW90ZWQgfHwgaXNEb3VibGVRdW90ZWQpIHtcclxuICAgICAgICAgICAgICAgIHZhbCA9IHZhbC5zdWJzdHJpbmcoMSwgZW5kKVxyXG5cclxuICAgICAgICAgICAgICAgIC8vIGlmIGRvdWJsZSBxdW90ZWQsIGV4cGFuZCBuZXdsaW5lc1xyXG4gICAgICAgICAgICAgICAgaWYgKGlzRG91YmxlUXVvdGVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFsID0gdmFsLnJlcGxhY2UoUkVfTkVXTElORVMsIE5FV0xJTkUpXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvLyByZW1vdmUgc3Vycm91bmRpbmcgd2hpdGVzcGFjZVxyXG4gICAgICAgICAgICAgICAgdmFsID0gdmFsLnRyaW0oKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG9ialtrZXldID0gdmFsXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coYGRpZCBub3QgbWF0Y2gga2V5IGFuZCB2YWx1ZSB3aGVuIHBhcnNpbmcgbGluZSAke2lkeCArIDF9OiAke2xpbmV9YClcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuICAgIHJldHVybiBvYmpcclxufVxyXG5leHBvcnQgY2xhc3MgU2VjcmV0c0ZvdW5kcnkge1xyXG4gICAgcHVibGljIHJlYWRGaWxlKGZpbGVQYXRoOiBzdHJpbmcpOiB7IFtrZXk6IHN0cmluZ106IHN0cmluZzsgfSB7XHJcbiAgICAgICAgLy8gc3BlY2lmeWluZyBhbiBlbmNvZGluZyByZXR1cm5zIGEgc3RyaW5nIGluc3RlYWQgb2YgYSBidWZmZXJcclxuICAgICAgICByZXR1cm4gcGFyc2UoZnMucmVhZEZpbGVTeW5jKGZpbGVQYXRoLCAndXRmOCcpKVxyXG4gICAgfVxyXG59Il19