"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecretsFoundry = void 0;
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const fs = require("fs");
const variables_1 = require("./variables");
/**
 * @stability stable
 */
class SecretsFoundry {
    /**
     * @stability stable
     */
    async readFile(filePath) {
        // specifying an encoding returns a string instead of a buffer
        const inputBuffer = fs.readFileSync(filePath, "utf8");
        const NEWLINE = "\n";
        const RE_INI_KEY_VAL = /^\s*([\w.-]+)\s*=\s*(.*)?\s*$/;
        const RE_NEWLINES = /\\n/g;
        const NEWLINES_MATCH = /\r\n|\n|\r/;
        let obj = {};
        // convert Buffers before splitting into lines and processing
        const lines = inputBuffer.toString().split(NEWLINES_MATCH);
        for (const [idx, line] of lines.entries()) {
            // matching "KEY' and 'VAL' in 'KEY=VAL'
            const keyValueArr = line.match(RE_INI_KEY_VAL);
            if (keyValueArr != null) {
                let key = keyValueArr[1];
                // default undefined or missing values to empty string
                let val = keyValueArr[2] || "";
                const end = val.length - 1;
                const isDoubleQuoted = val[0] === '"' && val[end] === '"';
                const isSingleQuoted = val[0] === "'" && val[end] === "'";
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
                try {
                    obj[key] = await new variables_1.default().populate(val);
                }
                catch (error) {
                    throw new Error(error);
                }
            }
            else {
                throw new Error(`did not match key and value when parsing line ${idx + 1}: ${line}`);
            }
        }
        return obj;
    }
}
exports.SecretsFoundry = SecretsFoundry;
_a = JSII_RTTI_SYMBOL_1;
SecretsFoundry[_a] = { fqn: "secretsfoundry.SecretsFoundry", version: "1.0.0" };
const getData = async () => {
    try {
        const w = new SecretsFoundry();
        console.log(await w.readFile("./test.txt"));
    }
    catch (error) {
        console.log(error);
    }
};
getData();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLHlCQUEwQjtBQUMxQiwyQ0FBb0M7Ozs7QUFFcEMsTUFBYSxjQUFjOzs7O0lBQ2xCLEtBQUssQ0FBQyxRQUFRLENBQUMsUUFBZ0I7UUFDcEMsOERBQThEO1FBQzlELE1BQU0sV0FBVyxHQUFnQixFQUFFLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUVuRSxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUM7UUFDckIsTUFBTSxjQUFjLEdBQUcsK0JBQStCLENBQUM7UUFDdkQsTUFBTSxXQUFXLEdBQUcsTUFBTSxDQUFDO1FBQzNCLE1BQU0sY0FBYyxHQUFHLFlBQVksQ0FBQztRQUVwQyxJQUFJLEdBQUcsR0FBZ0QsRUFBRSxDQUFDO1FBRTFELDZEQUE2RDtRQUM3RCxNQUFNLEtBQUssR0FBRyxXQUFXLENBQUMsUUFBUSxFQUFFLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQzNELEtBQUssTUFBTSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsSUFBSSxLQUFLLENBQUMsT0FBTyxFQUFFLEVBQUU7WUFDekMsd0NBQXdDO1lBQ3hDLE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLENBQUM7WUFDL0MsSUFBSSxXQUFXLElBQUksSUFBSSxFQUFFO2dCQUN2QixJQUFJLEdBQUcsR0FBRyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3pCLHNEQUFzRDtnQkFDdEQsSUFBSSxHQUFHLEdBQVcsV0FBVyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztnQkFDdkMsTUFBTSxHQUFHLEdBQUcsR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7Z0JBQzNCLE1BQU0sY0FBYyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEdBQUcsQ0FBQztnQkFDMUQsTUFBTSxjQUFjLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLEtBQUssR0FBRyxDQUFDO2dCQUMxRCw0Q0FBNEM7Z0JBQzVDLElBQUksY0FBYyxJQUFJLGNBQWMsRUFBRTtvQkFDcEMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO29CQUM1QixvQ0FBb0M7b0JBQ3BDLElBQUksY0FBYyxFQUFFO3dCQUNsQixHQUFHLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsT0FBTyxDQUFDLENBQUM7cUJBQ3pDO2lCQUNGO3FCQUFNO29CQUNMLGdDQUFnQztvQkFDaEMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztpQkFDbEI7Z0JBQ0QsSUFBSTtvQkFDRixHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsTUFBTSxJQUFJLG1CQUFTLEVBQUUsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7aUJBQ2hEO2dCQUFDLE9BQU8sS0FBSyxFQUFFO29CQUNkLE1BQU0sSUFBSSxLQUFLLENBQUMsS0FBZSxDQUFDLENBQUM7aUJBQ2xDO2FBQ0Y7aUJBQU07Z0JBQ0wsTUFBTSxJQUFJLEtBQUssQ0FDYixpREFBaUQsR0FBRyxHQUFHLENBQUMsS0FBSyxJQUFJLEVBQUUsQ0FDcEUsQ0FBQzthQUNIO1NBQ0Y7UUFDRCxPQUFPLEdBQUcsQ0FBQztJQUNiLENBQUM7O0FBL0NILHdDQWdEQzs7O0FBQ0QsTUFBTSxPQUFPLEdBQUcsS0FBSyxJQUFJLEVBQUU7SUFDekIsSUFBSTtRQUNGLE1BQU0sQ0FBQyxHQUFHLElBQUksY0FBYyxFQUFFLENBQUM7UUFDL0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztLQUM3QztJQUFDLE9BQU8sS0FBSyxFQUFFO1FBQ2QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUNwQjtBQUNILENBQUMsQ0FBQztBQUVGLE9BQU8sRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGZzID0gcmVxdWlyZShcImZzXCIpO1xyXG5pbXBvcnQgdmFyaWFibGVzIGZyb20gXCIuL3ZhcmlhYmxlc1wiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFNlY3JldHNGb3VuZHJ5IHtcclxuICBwdWJsaWMgYXN5bmMgcmVhZEZpbGUoZmlsZVBhdGg6IHN0cmluZykge1xyXG4gICAgLy8gc3BlY2lmeWluZyBhbiBlbmNvZGluZyByZXR1cm5zIGEgc3RyaW5nIGluc3RlYWQgb2YgYSBidWZmZXJcclxuICAgIGNvbnN0IGlucHV0QnVmZmVyOiBmcy5QYXRoTGlrZSA9IGZzLnJlYWRGaWxlU3luYyhmaWxlUGF0aCwgXCJ1dGY4XCIpO1xyXG5cclxuICAgIGNvbnN0IE5FV0xJTkUgPSBcIlxcblwiO1xyXG4gICAgY29uc3QgUkVfSU5JX0tFWV9WQUwgPSAvXlxccyooW1xcdy4tXSspXFxzKj1cXHMqKC4qKT9cXHMqJC87XHJcbiAgICBjb25zdCBSRV9ORVdMSU5FUyA9IC9cXFxcbi9nO1xyXG4gICAgY29uc3QgTkVXTElORVNfTUFUQ0ggPSAvXFxyXFxufFxcbnxcXHIvO1xyXG5cclxuICAgIGxldCBvYmo6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIHwgUHJvbWlzZTxzdHJpbmc+IH0gPSB7fTtcclxuXHJcbiAgICAvLyBjb252ZXJ0IEJ1ZmZlcnMgYmVmb3JlIHNwbGl0dGluZyBpbnRvIGxpbmVzIGFuZCBwcm9jZXNzaW5nXHJcbiAgICBjb25zdCBsaW5lcyA9IGlucHV0QnVmZmVyLnRvU3RyaW5nKCkuc3BsaXQoTkVXTElORVNfTUFUQ0gpO1xyXG4gICAgZm9yIChjb25zdCBbaWR4LCBsaW5lXSBvZiBsaW5lcy5lbnRyaWVzKCkpIHtcclxuICAgICAgLy8gbWF0Y2hpbmcgXCJLRVknIGFuZCAnVkFMJyBpbiAnS0VZPVZBTCdcclxuICAgICAgY29uc3Qga2V5VmFsdWVBcnIgPSBsaW5lLm1hdGNoKFJFX0lOSV9LRVlfVkFMKTtcclxuICAgICAgaWYgKGtleVZhbHVlQXJyICE9IG51bGwpIHtcclxuICAgICAgICBsZXQga2V5ID0ga2V5VmFsdWVBcnJbMV07XHJcbiAgICAgICAgLy8gZGVmYXVsdCB1bmRlZmluZWQgb3IgbWlzc2luZyB2YWx1ZXMgdG8gZW1wdHkgc3RyaW5nXHJcbiAgICAgICAgbGV0IHZhbDogc3RyaW5nID0ga2V5VmFsdWVBcnJbMl0gfHwgXCJcIjtcclxuICAgICAgICBjb25zdCBlbmQgPSB2YWwubGVuZ3RoIC0gMTtcclxuICAgICAgICBjb25zdCBpc0RvdWJsZVF1b3RlZCA9IHZhbFswXSA9PT0gJ1wiJyAmJiB2YWxbZW5kXSA9PT0gJ1wiJztcclxuICAgICAgICBjb25zdCBpc1NpbmdsZVF1b3RlZCA9IHZhbFswXSA9PT0gXCInXCIgJiYgdmFsW2VuZF0gPT09IFwiJ1wiO1xyXG4gICAgICAgIC8vIGlmIHNpbmdsZSBvciBkb3VibGUgcXVvdGVkLCByZW1vdmUgcXVvdGVzXHJcbiAgICAgICAgaWYgKGlzU2luZ2xlUXVvdGVkIHx8IGlzRG91YmxlUXVvdGVkKSB7XHJcbiAgICAgICAgICB2YWwgPSB2YWwuc3Vic3RyaW5nKDEsIGVuZCk7XHJcbiAgICAgICAgICAvLyBpZiBkb3VibGUgcXVvdGVkLCBleHBhbmQgbmV3bGluZXNcclxuICAgICAgICAgIGlmIChpc0RvdWJsZVF1b3RlZCkge1xyXG4gICAgICAgICAgICB2YWwgPSB2YWwucmVwbGFjZShSRV9ORVdMSU5FUywgTkVXTElORSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIC8vIHJlbW92ZSBzdXJyb3VuZGluZyB3aGl0ZXNwYWNlXHJcbiAgICAgICAgICB2YWwgPSB2YWwudHJpbSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgb2JqW2tleV0gPSBhd2FpdCBuZXcgdmFyaWFibGVzKCkucG9wdWxhdGUodmFsKTtcclxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGVycm9yIGFzIHN0cmluZyk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcclxuICAgICAgICAgIGBkaWQgbm90IG1hdGNoIGtleSBhbmQgdmFsdWUgd2hlbiBwYXJzaW5nIGxpbmUgJHtpZHggKyAxfTogJHtsaW5lfWBcclxuICAgICAgICApO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gb2JqO1xyXG4gIH1cclxufVxyXG5jb25zdCBnZXREYXRhID0gYXN5bmMgKCkgPT4ge1xyXG4gIHRyeSB7XHJcbiAgICBjb25zdCB3ID0gbmV3IFNlY3JldHNGb3VuZHJ5KCk7XHJcbiAgICBjb25zb2xlLmxvZyhhd2FpdCB3LnJlYWRGaWxlKFwiLi90ZXN0LnR4dFwiKSk7XHJcbiAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgIGNvbnNvbGUubG9nKGVycm9yKTtcclxuICB9XHJcbn07XHJcblxyXG5nZXREYXRhKCk7Il19