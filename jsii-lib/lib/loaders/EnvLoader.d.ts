import BaseLoader from './BaseLoader';
export default class EnvLoader implements BaseLoader {
    loadData(env_variable: string): string;
}
