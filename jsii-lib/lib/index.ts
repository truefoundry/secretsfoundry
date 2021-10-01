import fs = require('fs')

const NEWLINE = '\n'
const RE_INI_KEY_VAL = /^\s*([\w.-]+)\s*=\s*(.*)?\s*$/
const RE_NEWLINES = /\\n/g
const NEWLINES_MATCH = /\r\n|\n|\r/

export function parse(inputBuffer: fs.PathLike) {
    let obj: { [key: string]: string; } = {}

    // convert Buffers before splitting into lines and processing
    inputBuffer.toString().split(NEWLINES_MATCH).forEach(function (line, idx) {
        // matching "KEY' and 'VAL' in 'KEY=VAL'
        const keyValueArr = line.match(RE_INI_KEY_VAL)
        if (keyValueArr != null) {
            let key = keyValueArr[1]
            // default undefined or missing values to empty string
            let val = (keyValueArr[2] || '')
            let end = val.length - 1
            let isDoubleQuoted = val[0] === '"' && val[end] === '"'
            let isSingleQuoted = val[0] === "'" && val[end] === "'"

            // if single or double quoted, remove quotes
            if (isSingleQuoted || isDoubleQuoted) {
                val = val.substring(1, end)

                // if double quoted, expand newlines
                if (isDoubleQuoted) {
                    val = val.replace(RE_NEWLINES, NEWLINE)
                }
            } else {
                // remove surrounding whitespace
                val = val.trim()
            }
            // assign the key-value pair to obj
            obj[key] = val
        } else {
            console.log(`did not match key and value when parsing line ${idx + 1}: ${line}`)
        }
    });
    return obj
}
export class SecretsFoundry {
    public readFile(filePath: string): { [key: string]: string; } {
        // specifying an encoding returns a string instead of a buffer
        return parse(fs.readFileSync(filePath, 'utf8'))
    }
}