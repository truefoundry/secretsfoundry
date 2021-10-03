import fs = require('fs');
import Loader from './loader';

const NEWLINE = '\n';
const RE_INI_KEY_VAL = /^\s*([\w.-]+)\s*=\s*(.*)?\s*$/;
const RE_NEWLINES = /\\n/g;
const NEWLINES_MATCH = /\r\n|\n|\r/;
const VARIABLES_MATCH = /\${[\w]+?:.+?}/g;

export function parse(inputBuffer: fs.PathLike) {
  let obj: { [key: string]: string } = {};

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
            val = new Loader().loadData(refKey, refValue);
          }
        } while (variables);

        // if single or double quoted, remove quotes
        if (isSingleQuoted || isDoubleQuoted) {
          val = val.substring(1, end);

          // if double quoted, expand newlines
          if (isDoubleQuoted) {
            val = val.replace(RE_NEWLINES, NEWLINE);
          }
        } else {
          // remove surrounding whitespace
          val = val.trim();
        }
        // assign the key-value pair to obj
        obj[key] = val;
      } else {
        console.log(
          `did not match key and value when parsing line ${idx + 1}: ${line}`
        );
      }
    });
  return obj;
}
export class SecretsFoundry {
  public readFile(filePath: string): { [key: string]: string } {
    // specifying an encoding returns a string instead of a buffer
    return parse(fs.readFileSync(filePath, 'utf8'));
  }
}
