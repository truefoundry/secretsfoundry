import { awsSecretsLoader } from '../../src/loaders';

describe('awsSecretsLoader', () => {
  it('should resolve(without args)', () => {
    const loader = new awsSecretsLoader();
    const { isResolved } = loader.canResolve(
      '${aws-secrets:DdApiKeySecret-wCz8MKOzJgWn'
    );
    expect(isResolved).toBeTruthy();
  });

  it('should resolve(with args)', () => {
    const loader = new awsSecretsLoader();
    const { isResolved } = loader.canResolve(
      "${aws-secrets(region='us-east-2'):DdApiKeySecret-wCz8MKOzJgWn"
    );
    expect(isResolved).toBeTruthy();
  });

  it('should not resolve(without args)', () => {
    const loader = new awsSecretsLoader();
    const { isResolved } = loader.canResolve(
      '${aws-secretsDdApiKeySecret-wCz8MKOzJgWn'
    );
    expect(isResolved).not.toBeTruthy();
  });

  it('should not resolve(with args)', () => {
    const loader = new awsSecretsLoader();
    const { isResolved } = loader.canResolve(
      "${aws-secrets(region='us-east-4'):DdApiKeySecret-wCz8MKOzJgWn"
    );
    expect(isResolved).not.toBeTruthy();
  });
});
