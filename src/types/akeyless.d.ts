declare module 'akeyless' {
  export class ApiClient {
    basePath: string;
  }

  export class V2Api {
    constructor(client: ApiClient);
    auth(body: unknown): Promise<{ token?: string; expiration?: string }>;
    getSecretValue(body: unknown): Promise<Record<string, unknown>>;
    getDynamicSecretValue(body: unknown): Promise<unknown>;
    getRotatedSecretValue(body: unknown): Promise<unknown>;
  }

  export const Auth: {
    constructFromObject(data: Record<string, unknown>): unknown;
  };

  export const GetSecretValue: {
    constructFromObject(data: Record<string, unknown>): unknown;
  };

  export const GetDynamicSecretValue: {
    constructFromObject(data: Record<string, unknown>): unknown;
  };

  export const GetRotatedSecretValue: {
    constructFromObject(data: Record<string, unknown>): unknown;
  };
}
