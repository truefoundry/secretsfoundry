import awsS3Loader from '../../src/loaders/AwsS3Loader';

describe('AwsS3Loader', () => {
  it('should resolve(without args)', () => {
    const loader = new awsS3Loader();
    const isResolved = loader.canResolve('aws-s3:python/testing');
    expect(isResolved).toBeTruthy();
  });

  it('should resolve(with args)', () => {
    const loader = new awsS3Loader();
    const isResolved = loader.canResolve(
      "aws-s3(region='us-east-2'):python/testing"
    );
    expect(isResolved).toBeTruthy();
  });

  it('should not resolve(without args)', () => {
    const loader = new awsS3Loader();
    const isResolved = loader.canResolve('aws-s3python-api-key-words');
    expect(isResolved).not.toBeTruthy();
  });

  it('should not resolve(with args)', () => {
    const loader = new awsS3Loader();
    const isResolved = loader.canResolve(
      "aws-s3(region='us-est-2'):python-api;;key-words"
    );
    expect(isResolved).not.toBeTruthy();
  });

  it('should resolve aws S3', async () => {
    const loader = new awsS3Loader();
    expect(
      await loader.resolve(
        "aws-s3(region='us-east-2'):python/testing"
      )
    ).toStrictEqual('python-testing')
    expect(
      await loader.resolve(
        "aws-s3(region='us-east-2'):javascript/testing"
      )
    ).toStrictEqual('javascript-testing')
  })
});
