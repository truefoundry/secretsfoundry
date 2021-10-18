import awsSSMLoader from '../../src/loaders/AwsSSMLoader';

describe('awsSSMLoader', () => {
  it('should resolve(without args)', () => {
    const loader = new awsSSMLoader();
    const isResolved = loader.canResolve('aws-ssm:ssm-key-uS1ge');
    expect(isResolved).toBeTruthy();
  });

  it('should resolve(with arg region)', () => {
    const loader = new awsSSMLoader();
    const isResolved = loader.canResolve(
      "aws-ssm(region='us-east-2'):ssm-key-uS1ge"
    );
    expect(isResolved).toBeTruthy();
  });

  it('should resolve(with arg decrypt)', () => {
    const loader = new awsSSMLoader();
    const isResolved = loader.canResolve(
      "aws-ssm(decrypt='true'):ssm-key-uS1ge"
    );
    expect(isResolved).toBeTruthy();
  });

  it('should resolve(with args region and decrypt)', () => {
    const loader = new awsSSMLoader();
    const isResolved = loader.canResolve(
      "aws-ssm(region='us-east-2', decrypt='true'):ssm-key-uS1ge"
    );
    expect(isResolved).toBeTruthy();
  });

  it('should not resolve(without args)', () => {
    const loader = new awsSSMLoader();
    const isResolved = loader.canResolve('aws-ss:ssm-key-uS1ge');
    expect(isResolved).not.toBeTruthy();
  });

  it('should not resolve(with arg region)', () => {
    const loader = new awsSSMLoader();
    const isResolved = loader.canResolve(
      "aws-ssm(region='asia-4'):ssm-k@y-uS1ge"
    );
    expect(isResolved).not.toBeTruthy();
  });

  it('should not resolve(with arg decrypt)', () => {
    const loader = new awsSSMLoader();
    const isResolved = loader.canResolve(
      "aws-ssm(decrypt='1'):ssm;;-key-uS1ge"
    );
    expect(isResolved).not.toBeTruthy();
  });

  it('should not resolve(with both arguments)', () => {
    const loader = new awsSSMLoader();
    const isResolved = loader.canResolve(
      "aws-ssm(region='us-east-2' decrypt='1')ssm-key-uS1ge"
    );
    expect(isResolved).not.toBeTruthy();
  });

  it('should resolve aws secrets', async () => {
    const loader = new awsSSMLoader();
    const result = await loader.resolve(
      "aws-ssm(region=us-east-2, decrypt=true):ssm-key-uS1ge"
    );
    expect(result).toStrictEqual('ssm-key-uS1ge-true')
  })
});
