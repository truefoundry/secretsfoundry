import Utils from '../src/utils';
import AwsSecretsLoader from '../src/loaders/AwsSecretsLoader';
import AWS from 'aws-sdk';
import AWSMock from 'aws-sdk-mock';
import './setup/aws-sdk';

describe('getScriptArgs uses the user shell', () => {
  const script = 'npm i && npm --version';
  const originalShell = process.env.SHELL;

  afterEach(() => {
    if (originalShell === undefined) {
      delete process.env.SHELL;
    } else {
      process.env.SHELL = originalShell;
    }
  });

  it('should use SHELL=/bin/zsh on Unix', () => {
    if (process.platform === 'win32') {
      return;
    }
    process.env.SHELL = '/bin/zsh';
    expect(Utils.getScriptArgs(script)).toEqual(['/bin/zsh', '-c', script]);
  });
});

describe('convertToEnv quotes values that would inject extra env lines', () => {
  it('should not treat a newline inside a secret as a second assignment', () => {
    const out = Utils.convertToEnv({
      API_KEY: 'abc\nMALICIOUS=1',
    });
    const assignments = out
      .split('\n')
      .filter((line) => line && !line.startsWith(' ') && line.includes('='));
    const keys = assignments.map((line) => line.split('=', 1)[0]);
    expect(keys).toEqual(['API_KEY']);
    expect(out).not.toMatch(/^MALICIOUS=/m);
  });

  it('should keep simple values unchanged', () => {
    expect(Utils.convertToEnv({ FOO: 'bar' })).toBe('FOO=bar');
  });
});

describe('AwsSecretsLoader error when SecretString is missing', () => {
  const loader = new AwsSecretsLoader();

  afterEach(() => {
    AWSMock.restore('SecretsManager');
    AWSMock.mock(
      'SecretsManager',
      'getSecretValue',
      (
        params: { SecretId: string },
        callback: (err: Error | undefined, data: unknown) => void
      ) => {
        return callback(undefined, { SecretString: params.SecretId });
      }
    );
  });

  it('should include the secret variable in the error message', async () => {
    AWSMock.restore('SecretsManager');
    AWSMock.setSDKInstance(AWS);
    AWSMock.mock(
      'SecretsManager',
      'getSecretValue',
      (
        _params: { SecretId: string },
        callback: (err: Error | undefined, data: unknown) => void
      ) => {
        return callback(undefined, { SecretBinary: Buffer.from('ignored') });
      }
    );
    const variable = 'aws-secrets:binary-secret';
    await expect(loader.resolve(variable)).rejects.toThrow(variable);
    await expect(loader.resolve(variable)).rejects.not.toThrow(
      '${secretsVariable}'
    );
  });
});
