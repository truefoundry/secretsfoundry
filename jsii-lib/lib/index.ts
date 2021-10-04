import fs = require("fs");
import Variables from "./Variables";

const NEWLINE = "\n";
const RE_INI_KEY_VAL = /^\s*([\w.-]+)\s*=\s*(.*)?\s*$/;
const RE_NEWLINES = /\\n/g;
const NEWLINES_MATCH = /\r\n|\n|\r/;

export async function parse(inputBuffer: fs.PathLike) {
  let obj: { [key: string]: string | Promise<string> } = {};

  // convert Buffers before splitting into lines and processing
  const lines = inputBuffer.toString().split(NEWLINES_MATCH);

  for (const [idx, line] of lines.entries()) {
    // matching "KEY' and 'VAL' in 'KEY=VAL'
    const keyValueArr = line.match(RE_INI_KEY_VAL);
    if (keyValueArr != null) {
      let key = keyValueArr[1];
      // default undefined or missing values to empty string
      let val: string | Promise<string> = keyValueArr[2] || "";
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
      } else {
        // remove surrounding whitespace
        val = val.trim();
      }
      // assign the key-value pair to obj

      obj[key] = (await new Variables().populate(val)) || val;
    } else {
      console.log(
        `did not match key and value when parsing line ${idx + 1}: ${line}`
      );
    }
  }
  return obj;
}
export class SecretsFoundry {
  public async readFile(filePath: string) {
    // specifying an encoding returns a string instead of a buffer
    return await parse(fs.readFileSync(filePath, "utf8"));
  }
}

const getData = async () => {
  const w = new SecretsFoundry();
  console.log(await w.readFile("./test.txt"));
};

getData();
