import AkeylessLoader from '../../src/loaders/AkeylessLoader';

const mockAuth = jest.fn();
const mockGetSecretValue = jest.fn();
const mockGetDynamicSecretValue = jest.fn();
const mockGetRotatedSecretValue = jest.fn();

jest.mock('akeyless', () => ({
  ApiClient: jest.fn().mockImplementation(() => ({ basePath: '' })),
  V2Api: jest.fn().mockImplementation(() => ({
    auth: mockAuth,
    getSecretValue: mockGetSecretValue,
    getDynamicSecretValue: mockGetDynamicSecretValue,
    getRotatedSecretValue: mockGetRotatedSecretValue,
  })),
  Auth: {
    constructFromObject: (data: Record<string, unknown>) => data,
  },
  GetSecretValue: {
    constructFromObject: (data: Record<string, unknown>) => data,
  },
  GetDynamicSecretValue: {
    constructFromObject: (data: Record<string, unknown>) => data,
  },
  GetRotatedSecretValue: {
    constructFromObject: (data: Record<string, unknown>) => data,
  },
}));

describe('AkeylessLoader', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
    mockAuth.mockReset();
    mockGetSecretValue.mockReset();
    mockGetDynamicSecretValue.mockReset();
    mockGetRotatedSecretValue.mockReset();
    mockAuth.mockResolvedValue({ token: 'test-token' });
    mockGetSecretValue.mockResolvedValue({ '/app/db': 'secret-value' });
    mockGetDynamicSecretValue.mockResolvedValue({
      password: 'dyn-pass',
      user: 'dyn-user',
    });
    mockGetRotatedSecretValue.mockResolvedValue({
      value: 'rotated-json',
    });
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it('should return true on canResolve for valid patterns', () => {
    const loader = new AkeylessLoader();
    const valid = [
      'akeyless:/app/db',
      'akeyless:app/db',
      'akeyless(gateway=https://gw.example.com:8080/v2):/app/db',
      'akeyless(ignore-cache=true,json=true):/app/db',
      'akeyless_dynamic:/dyn/db',
      'akeyless_dynamic(timeout=60):/dyn/db',
      'akeyless_dynamic(args=a|b):/dyn/db',
      'akeyless_rotated:/rot/db',
      'akeyless_rotated(host=my.host):/rot/db',
    ];
    for (const v of valid) {
      expect(loader.canResolve(v)).toBeTruthy();
    }
  });

  it('should return false on canResolve for invalid patterns', () => {
    const loader = new AkeylessLoader();
    const invalid = [
      '',
      'akeyless:',
      'akeyless@:/x',
      'akeyless-ssm:/x',
      'akeyless-dynamic:/x',
      'aws-ssm:/x',
    ];
    for (const v of invalid) {
      expect(loader.canResolve(v)).not.toBeTruthy();
    }
  });

  it('should resolve using AKEYLESS_ACCESS_ID and AKEYLESS_ACCESS_KEY', async () => {
    process.env.AKEYLESS_ACCESS_ID = 'id';
    process.env.AKEYLESS_ACCESS_KEY = 'key';
    delete process.env.AKEYLESS_TOKEN;
    mockGetSecretValue.mockResolvedValueOnce({ '/app/db': 'from-mock' });

    const loader = new AkeylessLoader();
    const out = await loader.resolve('akeyless:/app/db');
    expect(out).toBe('from-mock');
    expect(mockAuth).toHaveBeenCalledTimes(1);
    expect(mockGetSecretValue).toHaveBeenCalledWith(
      expect.objectContaining({
        names: ['/app/db'],
        token: 'test-token',
      })
    );
  });

  it('should call /auth once when the same loader resolves multiple secrets', async () => {
    process.env.AKEYLESS_ACCESS_ID = 'id';
    process.env.AKEYLESS_ACCESS_KEY = 'key';
    delete process.env.AKEYLESS_TOKEN;
    mockAuth.mockResolvedValue({ token: 'tok', expiration: '4102444800000' });
    mockGetSecretValue
      .mockResolvedValueOnce({ '/a': '1' })
      .mockResolvedValueOnce({ '/b': '2' });

    const loader = new AkeylessLoader();
    await expect(loader.resolve('akeyless:/a')).resolves.toBe('1');
    await expect(loader.resolve('akeyless:/b')).resolves.toBe('2');
    expect(mockAuth).toHaveBeenCalledTimes(1);
    expect(mockGetSecretValue).toHaveBeenCalledTimes(2);
  });

  it('should resolve using AKEYLESS_TOKEN without calling auth', async () => {
    process.env.AKEYLESS_TOKEN = 'pre-baked';
    delete process.env.AKEYLESS_ACCESS_ID;
    delete process.env.AKEYLESS_ACCESS_KEY;
    mockGetSecretValue.mockResolvedValueOnce({ '/app/db': 'tok-val' });

    const loader = new AkeylessLoader();
    const out = await loader.resolve('akeyless:/app/db');
    expect(out).toBe('tok-val');
    expect(mockAuth).not.toHaveBeenCalled();
    expect(mockGetSecretValue).toHaveBeenCalledWith(
      expect.objectContaining({
        token: 'pre-baked',
        names: ['/app/db'],
      })
    );
  });

  it('should pick value when response key omits leading slash', async () => {
    process.env.AKEYLESS_TOKEN = 't';
    mockGetSecretValue.mockResolvedValueOnce({ 'app/db': 'slashless' });

    const loader = new AkeylessLoader();
    const out = await loader.resolve('akeyless:app/db');
    expect(out).toBe('slashless');
  });

  it('should throw when auth is not configured', async () => {
    delete process.env.AKEYLESS_TOKEN;
    delete process.env.AKEYLESS_ACCESS_ID;
    delete process.env.AKEYLESS_ACCESS_KEY;

    const loader = new AkeylessLoader();
    await expect(loader.resolve('akeyless:/x')).rejects.toThrow(
      /AKEYLESS_TOKEN/
    );
  });

  it('should throw when response has no matching secret', async () => {
    process.env.AKEYLESS_TOKEN = 't';
    mockGetSecretValue.mockResolvedValueOnce({});

    const loader = new AkeylessLoader();
    await expect(loader.resolve('akeyless:/missing')).rejects.toThrow(
      /No value/
    );
  });

  it('should not return a different key when the requested path is missing', async () => {
    process.env.AKEYLESS_TOKEN = 't';
    mockGetSecretValue.mockResolvedValueOnce({
      '/other/secret': 'wrong-one',
    });

    const loader = new AkeylessLoader();
    await expect(loader.resolve('akeyless:/wanted/secret')).rejects.toThrow(
      /No value/
    );
  });

  it('should return empty string when the requested key exists with empty value', async () => {
    process.env.AKEYLESS_TOKEN = 't';
    mockGetSecretValue.mockResolvedValueOnce({ '/app/db': '' });

    const loader = new AkeylessLoader();
    await expect(loader.resolve('akeyless:/app/db')).resolves.toBe('');
  });

  it('should throw on invalid version argument', async () => {
    process.env.AKEYLESS_TOKEN = 't';

    const loader = new AkeylessLoader();
    await expect(
      loader.resolve('akeyless(version=not-a-number):/app/db')
    ).rejects.toThrow(/version/);
  });

  it('should resolve dynamic secret as JSON string', async () => {
    process.env.AKEYLESS_TOKEN = 't';
    mockGetDynamicSecretValue.mockResolvedValueOnce({ p: 1 });

    const loader = new AkeylessLoader();
    const out = await loader.resolve('akeyless_dynamic(timeout=30):/dyn/x');
    expect(out).toBe('{"p":1}');
    expect(mockGetDynamicSecretValue).toHaveBeenCalledWith(
      expect.objectContaining({
        name: '/dyn/x',
        token: 't',
        timeout: 30,
      })
    );
  });

  it('should pass pipe-separated args to dynamic secret', async () => {
    process.env.AKEYLESS_TOKEN = 't';

    const loader = new AkeylessLoader();
    await loader.resolve(
      'akeyless_dynamic(args=--k=v|--x=y):/dyn/x'
    );
    expect(mockGetDynamicSecretValue).toHaveBeenCalledWith(
      expect.objectContaining({
        args: ['--k=v', '--x=y'],
      })
    );
  });

  it('should resolve rotated secret as JSON string', async () => {
    process.env.AKEYLESS_TOKEN = 't';

    const loader = new AkeylessLoader();
    const out = await loader.resolve(
      'akeyless_rotated(host=h.example):/rot/item'
    );
    expect(out).toBe('{"value":"rotated-json"}');
    expect(mockGetRotatedSecretValue).toHaveBeenCalledWith(
      expect.objectContaining({
        names: '/rot/item',
        token: 't',
        host: 'h.example',
      })
    );
  });

  it('should use AKEYLESS_ROTATED_SECRET_HOST when arg omitted', async () => {
    process.env.AKEYLESS_TOKEN = 't';
    process.env.AKEYLESS_ROTATED_SECRET_HOST = 'from-env';

    const loader = new AkeylessLoader();
    await loader.resolve('akeyless_rotated:/rot/item');
    expect(mockGetRotatedSecretValue).toHaveBeenCalledWith(
      expect.objectContaining({ host: 'from-env' })
    );
  });

  it('should throw on invalid dynamic timeout', async () => {
    process.env.AKEYLESS_TOKEN = 't';

    const loader = new AkeylessLoader();
    await expect(
      loader.resolve('akeyless_dynamic(timeout=bad):/x')
    ).rejects.toThrow(/timeout/);
  });
});
