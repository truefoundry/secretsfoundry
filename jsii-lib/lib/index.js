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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLHlCQUEwQjtBQUMxQiwyQ0FBb0M7Ozs7QUFFcEMsTUFBYSxjQUFjOzs7O0lBQ2xCLEtBQUssQ0FBQyxRQUFRLENBQUMsUUFBZ0I7UUFDcEMsOERBQThEO1FBQzlELE1BQU0sV0FBVyxHQUFnQixFQUFFLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUVuRSxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUM7UUFDckIsTUFBTSxjQUFjLEdBQUcsK0JBQStCLENBQUM7UUFDdkQsTUFBTSxXQUFXLEdBQUcsTUFBTSxDQUFDO1FBQzNCLE1BQU0sY0FBYyxHQUFHLFlBQVksQ0FBQztRQUVwQyxJQUFJLEdBQUcsR0FBZ0QsRUFBRSxDQUFDO1FBRTFELDZEQUE2RDtRQUM3RCxNQUFNLEtBQUssR0FBRyxXQUFXLENBQUMsUUFBUSxFQUFFLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQzNELEtBQUssTUFBTSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsSUFBSSxLQUFLLENBQUMsT0FBTyxFQUFFLEVBQUU7WUFDekMsd0NBQXdDO1lBQ3hDLE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLENBQUM7WUFDL0MsSUFBSSxXQUFXLElBQUksSUFBSSxFQUFFO2dCQUN2QixJQUFJLEdBQUcsR0FBRyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3pCLHNEQUFzRDtnQkFDdEQsSUFBSSxHQUFHLEdBQVcsV0FBVyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztnQkFDdkMsTUFBTSxHQUFHLEdBQUcsR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7Z0JBQzNCLE1BQU0sY0FBYyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEdBQUcsQ0FBQztnQkFDMUQsTUFBTSxjQUFjLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLEtBQUssR0FBRyxDQUFDO2dCQUMxRCw0Q0FBNEM7Z0JBQzVDLElBQUksY0FBYyxJQUFJLGNBQWMsRUFBRTtvQkFDcEMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO29CQUM1QixvQ0FBb0M7b0JBQ3BDLElBQUksY0FBYyxFQUFFO3dCQUNsQixHQUFHLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsT0FBTyxDQUFDLENBQUM7cUJBQ3pDO2lCQUNGO3FCQUFNO29CQUNMLGdDQUFnQztvQkFDaEMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztpQkFDbEI7Z0JBQ0QsSUFBSTtvQkFDRixHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsTUFBTSxJQUFJLG1CQUFTLEVBQUUsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7aUJBQ2hEO2dCQUFDLE9BQU8sS0FBSyxFQUFFO29CQUNkLE1BQU0sSUFBSSxLQUFLLENBQUMsS0FBZSxDQUFDLENBQUM7aUJBQ2xDO2FBQ0Y7aUJBQU07Z0JBQ0wsTUFBTSxJQUFJLEtBQUssQ0FDYixpREFBaUQsR0FBRyxHQUFHLENBQUMsS0FBSyxJQUFJLEVBQUUsQ0FDcEUsQ0FBQzthQUNIO1NBQ0Y7UUFDRCxPQUFPLEdBQUcsQ0FBQztJQUNiLENBQUM7O0FBL0NILHdDQWdEQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBmcyA9IHJlcXVpcmUoXCJmc1wiKTtcclxuaW1wb3J0IHZhcmlhYmxlcyBmcm9tIFwiLi92YXJpYWJsZXNcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBTZWNyZXRzRm91bmRyeSB7XHJcbiAgcHVibGljIGFzeW5jIHJlYWRGaWxlKGZpbGVQYXRoOiBzdHJpbmcpIHtcclxuICAgIC8vIHNwZWNpZnlpbmcgYW4gZW5jb2RpbmcgcmV0dXJucyBhIHN0cmluZyBpbnN0ZWFkIG9mIGEgYnVmZmVyXHJcbiAgICBjb25zdCBpbnB1dEJ1ZmZlcjogZnMuUGF0aExpa2UgPSBmcy5yZWFkRmlsZVN5bmMoZmlsZVBhdGgsIFwidXRmOFwiKTtcclxuXHJcbiAgICBjb25zdCBORVdMSU5FID0gXCJcXG5cIjtcclxuICAgIGNvbnN0IFJFX0lOSV9LRVlfVkFMID0gL15cXHMqKFtcXHcuLV0rKVxccyo9XFxzKiguKik/XFxzKiQvO1xyXG4gICAgY29uc3QgUkVfTkVXTElORVMgPSAvXFxcXG4vZztcclxuICAgIGNvbnN0IE5FV0xJTkVTX01BVENIID0gL1xcclxcbnxcXG58XFxyLztcclxuXHJcbiAgICBsZXQgb2JqOiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB8IFByb21pc2U8c3RyaW5nPiB9ID0ge307XHJcblxyXG4gICAgLy8gY29udmVydCBCdWZmZXJzIGJlZm9yZSBzcGxpdHRpbmcgaW50byBsaW5lcyBhbmQgcHJvY2Vzc2luZ1xyXG4gICAgY29uc3QgbGluZXMgPSBpbnB1dEJ1ZmZlci50b1N0cmluZygpLnNwbGl0KE5FV0xJTkVTX01BVENIKTtcclxuICAgIGZvciAoY29uc3QgW2lkeCwgbGluZV0gb2YgbGluZXMuZW50cmllcygpKSB7XHJcbiAgICAgIC8vIG1hdGNoaW5nIFwiS0VZJyBhbmQgJ1ZBTCcgaW4gJ0tFWT1WQUwnXHJcbiAgICAgIGNvbnN0IGtleVZhbHVlQXJyID0gbGluZS5tYXRjaChSRV9JTklfS0VZX1ZBTCk7XHJcbiAgICAgIGlmIChrZXlWYWx1ZUFyciAhPSBudWxsKSB7XHJcbiAgICAgICAgbGV0IGtleSA9IGtleVZhbHVlQXJyWzFdO1xyXG4gICAgICAgIC8vIGRlZmF1bHQgdW5kZWZpbmVkIG9yIG1pc3NpbmcgdmFsdWVzIHRvIGVtcHR5IHN0cmluZ1xyXG4gICAgICAgIGxldCB2YWw6IHN0cmluZyA9IGtleVZhbHVlQXJyWzJdIHx8IFwiXCI7XHJcbiAgICAgICAgY29uc3QgZW5kID0gdmFsLmxlbmd0aCAtIDE7XHJcbiAgICAgICAgY29uc3QgaXNEb3VibGVRdW90ZWQgPSB2YWxbMF0gPT09ICdcIicgJiYgdmFsW2VuZF0gPT09ICdcIic7XHJcbiAgICAgICAgY29uc3QgaXNTaW5nbGVRdW90ZWQgPSB2YWxbMF0gPT09IFwiJ1wiICYmIHZhbFtlbmRdID09PSBcIidcIjtcclxuICAgICAgICAvLyBpZiBzaW5nbGUgb3IgZG91YmxlIHF1b3RlZCwgcmVtb3ZlIHF1b3Rlc1xyXG4gICAgICAgIGlmIChpc1NpbmdsZVF1b3RlZCB8fCBpc0RvdWJsZVF1b3RlZCkge1xyXG4gICAgICAgICAgdmFsID0gdmFsLnN1YnN0cmluZygxLCBlbmQpO1xyXG4gICAgICAgICAgLy8gaWYgZG91YmxlIHF1b3RlZCwgZXhwYW5kIG5ld2xpbmVzXHJcbiAgICAgICAgICBpZiAoaXNEb3VibGVRdW90ZWQpIHtcclxuICAgICAgICAgICAgdmFsID0gdmFsLnJlcGxhY2UoUkVfTkVXTElORVMsIE5FV0xJTkUpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAvLyByZW1vdmUgc3Vycm91bmRpbmcgd2hpdGVzcGFjZVxyXG4gICAgICAgICAgdmFsID0gdmFsLnRyaW0oKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgIG9ialtrZXldID0gYXdhaXQgbmV3IHZhcmlhYmxlcygpLnBvcHVsYXRlKHZhbCk7XHJcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihlcnJvciBhcyBzdHJpbmcpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXHJcbiAgICAgICAgICBgZGlkIG5vdCBtYXRjaCBrZXkgYW5kIHZhbHVlIHdoZW4gcGFyc2luZyBsaW5lICR7aWR4ICsgMX06ICR7bGluZX1gXHJcbiAgICAgICAgKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIG9iajtcclxuICB9XHJcbn1cclxuIl19