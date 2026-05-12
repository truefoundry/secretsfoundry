import { createHash } from 'crypto';
import Loader from './loader';

/** Lazy require so importing `Loaders` does not load the SDK (Jest / tree-shaking friendly). */
const loadAkeyless = function (): typeof import('akeyless') {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  return require('akeyless');
};

const normalizePath = function (p: string): string {
  return p.startsWith('/') ? p : `/${p}`;
};

const stringifySecretValue = function (value: unknown): string {
  if (value === null || value === undefined) {
    return '';
  }
  if (typeof value === 'string') {
    return value;
  }
  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  return JSON.stringify(value);
};

const pickSecretFromResponse = function (
  requestedPath: string,
  data: Record<string, unknown> | null | undefined
): string {
  if (!data || typeof data !== 'object') {
    throw new Error('Akeyless returned an empty secret payload');
  }
  const trimmed = requestedPath.trim();
  const candidates = [
    trimmed,
    normalizePath(trimmed),
    trimmed.replace(/^\//, ''),
  ];
  for (const key of candidates) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      // Return the value for this key even when empty — do not fall through to
      // another key (avoids returning an unrelated secret from the same payload).
      return stringifySecretValue(data[key]);
    }
  }
  throw new Error(`No value for "${requestedPath}" in Akeyless response`);
};

/** Dynamic / rotated APIs return a JSON object; stringify for interpolation (same idea as the Buildkite plugin). */
const formatStructuredResponse = function (data: unknown): string {
  if (data === null || data === undefined) {
    throw new Error('Akeyless returned an empty response');
  }
  if (typeof data === 'string') {
    return data;
  }
  return JSON.stringify(data);
};

const getGatewayUrl = function (args: Record<string, string | undefined>): string {
  return (
    args.gateway ||
    process.env.AKEYLESS_GATEWAY_URL?.trim() ||
    'https://api.akeyless.io'
  ).replace(/\/$/, '');
};

const splitPipeList = function (raw: string | undefined): string[] | undefined {
  if (raw === undefined || raw.trim() === '') {
    return undefined;
  }
  const parts = raw.split('|').map((s) => s.trim()).filter(Boolean);
  return parts.length ? parts : undefined;
};

/** SHA-256 hex for cache keys — avoids keeping raw secrets in fingerprint strings. */
const sha256Hex = function (value: string): string {
  return createHash('sha256').update(value, 'utf8').digest('hex');
};

/** Default access-key session length if /auth omits expiration (typical token ~15m). */
const ACCESS_KEY_DEFAULT_TTL_MS = 14 * 60 * 1000;

/** Pre-baked token cache window (no server hint). */
const ENV_TOKEN_TTL_MS = 50 * 60 * 1000;

/** Refresh slightly before expiry to avoid edge failures. */
const EXPIRY_MARGIN_MS = 60 * 1000;

const expiryFromAuthOutput = function (authOut: {
  expiration?: string;
}): number {
  const exp = authOut?.expiration?.trim();
  const now = Date.now();
  if (!exp) {
    return now + ACCESS_KEY_DEFAULT_TTL_MS;
  }
  const asNum = Number(exp);
  if (Number.isFinite(asNum) && asNum > 1e12) {
    return asNum;
  }
  if (Number.isFinite(asNum) && asNum > 1e9) {
    return asNum * 1000;
  }
  const parsed = Date.parse(exp);
  if (!Number.isNaN(parsed)) {
    return parsed;
  }
  return now + ACCESS_KEY_DEFAULT_TTL_MS;
};

type AkeylessArgs = Record<string, string | undefined>;

type CachedAkeylessSession = {
  fingerprint: string;
  gateway: string;
  api: import('akeyless').V2Api;
  sdk: typeof import('akeyless');
  token: string;
  expiresAtMs: number;
};

/**
 * Akeyless loaders for static, dynamic, and rotated secrets.
 *
 * Prefixes (underscores match `${...}` expansion rules in SecretsFoundry):
 * - `akeyless(optionalArgs):/path` — static secret (`get-secret-value`)
 * - `akeyless_dynamic(optionalArgs):/path` — dynamic secret (`get-dynamic-secret-value`)
 * - `akeyless_rotated(optionalArgs):/path` — rotated secret (`get-rotated-secret-value`)
 *
 * Environment (all kinds):
 * - AKEYLESS_GATEWAY_URL — API / Gateway base URL (default: https://api.akeyless.io)
 * - AKEYLESS_TOKEN — optional; if set, skips access-key auth
 * - AKEYLESS_ACCESS_ID and AKEYLESS_ACCESS_KEY — access_key auth when no token
 *
 * Optional args (comma-separated key=value):
 * - gateway — overrides AKEYLESS_GATEWAY_URL
 *
 * Static-only args: ignore-cache, json, version
 *
 * Dynamic-only args: timeout, args (pipe-separated entries, e.g. `args=--k=v|--x=y`), host, dbname, target, json
 * Env fallback: AKEYLESS_DYNAMIC_TIMEOUT, AKEYLESS_DYNAMIC_ARGS (pipe-separated)
 *
 * Rotated-only args: host (or AKEYLESS_ROTATED_SECRET_HOST), ignore-cache, json, version
 *
 * Session: one loader instance (as registered in `Loaders`) reuses the same `V2Api`
 * client and token until expiry or until gateway / credentials (fingerprint) change,
 * so resolving many secrets does not repeat `/auth` for each variable. Session
 * fingerprints use SHA-256 hashes of secret material (token or access id+key),
 * not raw credentials in strings.
 */
export default class AkeylessLoader extends Loader {
  private cachedSession: CachedAkeylessSession | null = null;

  private static STATIC_PATTERN =
    /^akeyless(\(([:a-zA-Z0-9_|;(=),\\.\-/]*)?\))?:([a-zA-Z0-9_.\-/]+)$/;

  private static DYNAMIC_PATTERN =
    /^akeyless_dynamic(\(([:a-zA-Z0-9_|;(=),\\.\-/]*)?\))?:([a-zA-Z0-9_.\-/]+)$/;

  private static ROTATED_PATTERN =
    /^akeyless_rotated(\(([:a-zA-Z0-9_|;(=),\\.\-/]*)?\))?:([a-zA-Z0-9_.\-/]+)$/;

  public canResolve(value: string): boolean {
    return (
      value.match(AkeylessLoader.STATIC_PATTERN) !== null ||
      value.match(AkeylessLoader.DYNAMIC_PATTERN) !== null ||
      value.match(AkeylessLoader.ROTATED_PATTERN) !== null
    );
  }

  public async resolve(variable: string): Promise<string> {
    const dynamic = variable.match(AkeylessLoader.DYNAMIC_PATTERN);
    if (dynamic) {
      return this.resolveDynamic(dynamic[2], dynamic[3]);
    }
    const rotated = variable.match(AkeylessLoader.ROTATED_PATTERN);
    if (rotated) {
      return this.resolveRotated(rotated[2], rotated[3]);
    }
    const stat = variable.match(AkeylessLoader.STATIC_PATTERN);
    if (stat) {
      return this.resolveStatic(stat[2], stat[3]);
    }
    throw new Error(
      'AkeylessLoader cannot parse the variable name. This should never happen \
since the client is supposed to be calling canResolve first'
    );
  }

  private sessionFingerprint(gateway: string): string {
    const t = process.env.AKEYLESS_TOKEN?.trim();
    if (t) {
      return `token:${gateway}:${sha256Hex(t)}`;
    }
    const accessId = process.env.AKEYLESS_ACCESS_ID?.trim() ?? '';
    const accessKey = process.env.AKEYLESS_ACCESS_KEY?.trim() ?? '';
    return `access_key:${gateway}:${sha256Hex(`${accessId}\0${accessKey}`)}`;
  }

  private async resolveTokenAndApi(args: AkeylessArgs): Promise<{
    api: import('akeyless').V2Api;
    token: string;
    sdk: typeof import('akeyless');
  }> {
    const gateway = getGatewayUrl(args);
    const fingerprint = this.sessionFingerprint(gateway);
    const now = Date.now();
    if (
      this.cachedSession &&
      this.cachedSession.fingerprint === fingerprint &&
      this.cachedSession.gateway === gateway &&
      now < this.cachedSession.expiresAtMs
    ) {
      return {
        api: this.cachedSession.api,
        token: this.cachedSession.token,
        sdk: this.cachedSession.sdk,
      };
    }

    const sdk = loadAkeyless();
    const client = new sdk.ApiClient();
    client.basePath = gateway;
    const api = new sdk.V2Api(client);

    let token = process.env.AKEYLESS_TOKEN?.trim();
    let expiresAtMs: number;
    if (token) {
      expiresAtMs = now + ENV_TOKEN_TTL_MS;
    } else {
      const accessId = process.env.AKEYLESS_ACCESS_ID?.trim();
      const accessKey = process.env.AKEYLESS_ACCESS_KEY?.trim();
      if (!accessId || !accessKey) {
        throw new Error(
          'Akeyless auth is not configured: set AKEYLESS_TOKEN, or both AKEYLESS_ACCESS_ID and AKEYLESS_ACCESS_KEY'
        );
      }
      const authBody = sdk.Auth.constructFromObject({
        'access-id': accessId,
        'access-key': accessKey,
        'access-type': 'access_key',
      });
      const authOut = await api.auth(authBody);
      token = authOut?.token?.trim();
      if (!token) {
        throw new Error('Akeyless authentication did not return a token');
      }
      expiresAtMs = expiryFromAuthOutput(authOut) - EXPIRY_MARGIN_MS;
      if (expiresAtMs <= now) {
        expiresAtMs = now + ACCESS_KEY_DEFAULT_TTL_MS;
      }
    }

    this.cachedSession = {
      fingerprint,
      gateway,
      api,
      sdk,
      token,
      expiresAtMs,
    };
    return { api, token, sdk };
  }

  private async resolveStatic(
    argsStr: string | undefined,
    secretPath: string
  ): Promise<string> {
    const args = this.getArgsFromStr(argsStr ?? '');
    const { api, token, sdk } = await this.resolveTokenAndApi(args);

    const getBody: Record<string, unknown> = {
      names: [secretPath],
      token,
    };
    if (args['ignore-cache'] !== undefined) {
      getBody['ignore-cache'] =
        args['ignore-cache'] === 'true' ? 'true' : 'false';
    }
    if (args.json === 'true') {
      getBody.json = true;
    }
    if (args.version !== undefined) {
      const n = Number(args.version);
      if (!Number.isFinite(n)) {
        throw new Error('Akeyless loader "version" argument must be a number');
      }
      getBody.version = n;
    }

    const payload = sdk.GetSecretValue.constructFromObject(getBody);
    const raw = (await api.getSecretValue(payload)) as Record<
      string,
      unknown
    >;
    return pickSecretFromResponse(secretPath, raw);
  }

  private async resolveDynamic(
    argsStr: string | undefined,
    secretName: string
  ): Promise<string> {
    const args = this.getArgsFromStr(argsStr ?? '');
    const { api, token, sdk } = await this.resolveTokenAndApi(args);

    const body: Record<string, unknown> = {
      name: secretName,
      token,
    };

    const timeoutStr =
      args.timeout || process.env.AKEYLESS_DYNAMIC_TIMEOUT?.trim();
    if (timeoutStr !== undefined) {
      const n = Number(timeoutStr);
      if (!Number.isFinite(n) || n < 0) {
        throw new Error(
          'Akeyless dynamic loader "timeout" must be a non-negative number'
        );
      }
      body.timeout = n;
    }

    const argList =
      splitPipeList(args.args) ||
      splitPipeList(process.env.AKEYLESS_DYNAMIC_ARGS);
    if (argList) {
      body.args = argList;
    }
    if (args.host) {
      body.host = args.host;
    }
    if (args.dbname) {
      body.dbname = args.dbname;
    }
    if (args.target) {
      body.target = args.target;
    }
    if (args.json === 'true') {
      body.json = true;
    }

    const payload = sdk.GetDynamicSecretValue.constructFromObject(body);
    const raw = await api.getDynamicSecretValue(payload);
    return formatStructuredResponse(raw);
  }

  private async resolveRotated(
    argsStr: string | undefined,
    secretPath: string
  ): Promise<string> {
    const args = this.getArgsFromStr(argsStr ?? '');
    const { api, token, sdk } = await this.resolveTokenAndApi(args);

    const body: Record<string, unknown> = {
      names: secretPath,
      token,
    };

    const host =
      args.host || process.env.AKEYLESS_ROTATED_SECRET_HOST?.trim();
    if (host) {
      body.host = host;
    }
    if (args['ignore-cache'] !== undefined) {
      body['ignore-cache'] =
        args['ignore-cache'] === 'true' ? 'true' : 'false';
    }
    if (args.json === 'true') {
      body.json = true;
    }
    if (args.version !== undefined) {
      const n = Number(args.version);
      if (!Number.isFinite(n)) {
        throw new Error(
          'Akeyless rotated loader "version" argument must be a number'
        );
      }
      body.version = n;
    }

    const payload = sdk.GetRotatedSecretValue.constructFromObject(body);
    const raw = await api.getRotatedSecretValue(payload);
    return formatStructuredResponse(raw);
  }
}
