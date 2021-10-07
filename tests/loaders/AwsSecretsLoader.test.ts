import { awsSecretsLoader } from '../../src/loaders';

describe('awsSecretsLoader', () => {
  it('should resolve(without args)', () => {
    const loader = new awsSecretsLoader();
    const { isResolved } = loader.canResolve(
      '${aws-secrets:secret-1-key-usage'
    );
    expect(isResolved).toBeTruthy();
  });

  it('should resolve(with args)', () => {
    const loader = new awsSecretsLoader();
    const { isResolved } = loader.canResolve(
      "${aws-secrets(region='us-east-2'):secret-1-key-usage"
    );
    expect(isResolved).toBeTruthy();
  });

  it('should not resolve(without args)', () => {
    const loader = new awsSecretsLoader();
    const { isResolved } = loader.canResolve('${aws-secretssecret-1-key-usage');
    expect(isResolved).not.toBeTruthy();
  });

  it('should not resolve(with args)', () => {
    const loader = new awsSecretsLoader();
    const { isResolved } = loader.canResolve(
      "${aws-secrets(region='us-east-4'):secret-1-key-usage"
    );
    expect(isResolved).not.toBeTruthy();
  });
});
