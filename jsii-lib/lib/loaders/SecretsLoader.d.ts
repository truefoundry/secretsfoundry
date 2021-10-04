import BaseLoader from './BaseLoader';
export default class SecretsLoader implements BaseLoader {
    loadData(secrets_variable: string): Promise<string>;
    private fetchData;
}
