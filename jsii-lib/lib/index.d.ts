/**
 * @stability stable
 */
export declare class SecretsFoundry {
    /**
     * @stability stable
     */
    readFile(filePath: string): Promise<{
        [key: string]: string | Promise<string>;
    }>;
}
