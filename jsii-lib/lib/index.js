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
    inputBuffer
        .toString()
        .split(NEWLINES_MATCH)
        .forEach(function (line, idx) {
        // matching "KEY' and 'VAL' in 'KEY=VAL'
        const keyValueArr = line.match(RE_INI_KEY_VAL);
        if (keyValueArr != null) {
            let key = keyValueArr[1];
            // default undefined or missing values to empty string
            let val = keyValueArr[2] || '';
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLHlCQUEwQjtBQUUxQixNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUM7QUFDckIsTUFBTSxjQUFjLEdBQUcsK0JBQStCLENBQUM7QUFDdkQsTUFBTSxXQUFXLEdBQUcsTUFBTSxDQUFDO0FBQzNCLE1BQU0sY0FBYyxHQUFHLFlBQVksQ0FBQztBQUVwQyxTQUFnQixLQUFLLENBQUMsV0FBd0I7SUFDNUMsSUFBSSxHQUFHLEdBQThCLEVBQUUsQ0FBQztJQUV4Qyw2REFBNkQ7SUFDN0QsV0FBVztTQUNSLFFBQVEsRUFBRTtTQUNWLEtBQUssQ0FBQyxjQUFjLENBQUM7U0FDckIsT0FBTyxDQUFDLFVBQVUsSUFBSSxFQUFFLEdBQUc7UUFDMUIsd0NBQXdDO1FBQ3hDLE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDL0MsSUFBSSxXQUFXLElBQUksSUFBSSxFQUFFO1lBQ3ZCLElBQUksR0FBRyxHQUFHLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN6QixzREFBc0Q7WUFDdEQsSUFBSSxHQUFHLEdBQUcsV0FBVyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUMvQixJQUFJLEdBQUcsR0FBRyxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztZQUN6QixJQUFJLGNBQWMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsS0FBSyxHQUFHLENBQUM7WUFDeEQsSUFBSSxjQUFjLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLEtBQUssR0FBRyxDQUFDO1lBRXhELDRDQUE0QztZQUM1QyxJQUFJLGNBQWMsSUFBSSxjQUFjLEVBQUU7Z0JBQ3BDLEdBQUcsR0FBRyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztnQkFFNUIsb0NBQW9DO2dCQUNwQyxJQUFJLGNBQWMsRUFBRTtvQkFDbEIsR0FBRyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLE9BQU8sQ0FBQyxDQUFDO2lCQUN6QzthQUNGO2lCQUFNO2dCQUNMLGdDQUFnQztnQkFDaEMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQzthQUNsQjtZQUNELG1DQUFtQztZQUNuQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDO1NBQ2hCO2FBQU07WUFDTCxPQUFPLENBQUMsR0FBRyxDQUNULGlEQUFpRCxHQUFHLEdBQUcsQ0FBQyxLQUFLLElBQUksRUFBRSxDQUNwRSxDQUFDO1NBQ0g7SUFDSCxDQUFDLENBQUMsQ0FBQztJQUNMLE9BQU8sR0FBRyxDQUFDO0FBQ2IsQ0FBQztBQXZDRCxzQkF1Q0M7Ozs7QUFDRCxNQUFhLGNBQWM7Ozs7SUFDbEIsUUFBUSxDQUFDLFFBQWdCO1FBQzlCLDhEQUE4RDtRQUM5RCxPQUFPLEtBQUssQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDO0lBQ2xELENBQUM7O0FBSkgsd0NBS0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZnMgPSByZXF1aXJlKCdmcycpO1xuXG5jb25zdCBORVdMSU5FID0gJ1xcbic7XG5jb25zdCBSRV9JTklfS0VZX1ZBTCA9IC9eXFxzKihbXFx3Li1dKylcXHMqPVxccyooLiopP1xccyokLztcbmNvbnN0IFJFX05FV0xJTkVTID0gL1xcXFxuL2c7XG5jb25zdCBORVdMSU5FU19NQVRDSCA9IC9cXHJcXG58XFxufFxcci87XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZShpbnB1dEJ1ZmZlcjogZnMuUGF0aExpa2UpIHtcbiAgbGV0IG9iajogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfSA9IHt9O1xuXG4gIC8vIGNvbnZlcnQgQnVmZmVycyBiZWZvcmUgc3BsaXR0aW5nIGludG8gbGluZXMgYW5kIHByb2Nlc3NpbmdcbiAgaW5wdXRCdWZmZXJcbiAgICAudG9TdHJpbmcoKVxuICAgIC5zcGxpdChORVdMSU5FU19NQVRDSClcbiAgICAuZm9yRWFjaChmdW5jdGlvbiAobGluZSwgaWR4KSB7XG4gICAgICAvLyBtYXRjaGluZyBcIktFWScgYW5kICdWQUwnIGluICdLRVk9VkFMJ1xuICAgICAgY29uc3Qga2V5VmFsdWVBcnIgPSBsaW5lLm1hdGNoKFJFX0lOSV9LRVlfVkFMKTtcbiAgICAgIGlmIChrZXlWYWx1ZUFyciAhPSBudWxsKSB7XG4gICAgICAgIGxldCBrZXkgPSBrZXlWYWx1ZUFyclsxXTtcbiAgICAgICAgLy8gZGVmYXVsdCB1bmRlZmluZWQgb3IgbWlzc2luZyB2YWx1ZXMgdG8gZW1wdHkgc3RyaW5nXG4gICAgICAgIGxldCB2YWwgPSBrZXlWYWx1ZUFyclsyXSB8fCAnJztcbiAgICAgICAgbGV0IGVuZCA9IHZhbC5sZW5ndGggLSAxO1xuICAgICAgICBsZXQgaXNEb3VibGVRdW90ZWQgPSB2YWxbMF0gPT09ICdcIicgJiYgdmFsW2VuZF0gPT09ICdcIic7XG4gICAgICAgIGxldCBpc1NpbmdsZVF1b3RlZCA9IHZhbFswXSA9PT0gXCInXCIgJiYgdmFsW2VuZF0gPT09IFwiJ1wiO1xuXG4gICAgICAgIC8vIGlmIHNpbmdsZSBvciBkb3VibGUgcXVvdGVkLCByZW1vdmUgcXVvdGVzXG4gICAgICAgIGlmIChpc1NpbmdsZVF1b3RlZCB8fCBpc0RvdWJsZVF1b3RlZCkge1xuICAgICAgICAgIHZhbCA9IHZhbC5zdWJzdHJpbmcoMSwgZW5kKTtcblxuICAgICAgICAgIC8vIGlmIGRvdWJsZSBxdW90ZWQsIGV4cGFuZCBuZXdsaW5lc1xuICAgICAgICAgIGlmIChpc0RvdWJsZVF1b3RlZCkge1xuICAgICAgICAgICAgdmFsID0gdmFsLnJlcGxhY2UoUkVfTkVXTElORVMsIE5FV0xJTkUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyByZW1vdmUgc3Vycm91bmRpbmcgd2hpdGVzcGFjZVxuICAgICAgICAgIHZhbCA9IHZhbC50cmltKCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gYXNzaWduIHRoZSBrZXktdmFsdWUgcGFpciB0byBvYmpcbiAgICAgICAgb2JqW2tleV0gPSB2YWw7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmxvZyhcbiAgICAgICAgICBgZGlkIG5vdCBtYXRjaCBrZXkgYW5kIHZhbHVlIHdoZW4gcGFyc2luZyBsaW5lICR7aWR4ICsgMX06ICR7bGluZX1gXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfSk7XG4gIHJldHVybiBvYmo7XG59XG5leHBvcnQgY2xhc3MgU2VjcmV0c0ZvdW5kcnkge1xuICBwdWJsaWMgcmVhZEZpbGUoZmlsZVBhdGg6IHN0cmluZyk6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH0ge1xuICAgIC8vIHNwZWNpZnlpbmcgYW4gZW5jb2RpbmcgcmV0dXJucyBhIHN0cmluZyBpbnN0ZWFkIG9mIGEgYnVmZmVyXG4gICAgcmV0dXJuIHBhcnNlKGZzLnJlYWRGaWxlU3luYyhmaWxlUGF0aCwgJ3V0ZjgnKSk7XG4gIH1cbn1cbiJdfQ==