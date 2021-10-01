/// <reference types="node" />
import fs = require('fs');
export declare function parse(inputBuffer: fs.PathLike): {
    [key: string]: string;
};
/**
 * @stability stable
 */
export declare class SecretsFoundry {
    /**
     * @stability stable
     */
    readFile(filePath: string): {
        [key: string]: string;
    };
}
