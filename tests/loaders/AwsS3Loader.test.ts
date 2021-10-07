import { awsS3Loader } from '../../src/loaders';

describe('AwsS3Loader', () => {
  it('should resolve(without args)', () => {
    const loader = new awsS3Loader();
    // colons for now, should be removed as required
    const { isResolved } = loader.canResolve('${aws-s3:python-api;;key-words');
    expect(isResolved).toBeTruthy();
  });

  it('should resolve(with args)', () => {
    const loader = new awsS3Loader();
    const { isResolved } = loader.canResolve(
      "${aws-s3(region='us-east-2'):python-api;;key-words"
    );
    expect(isResolved).toBeTruthy();
  });

  it('should not resolve(without args)', () => {
    const loader = new awsS3Loader();
    const { isResolved } = loader.canResolve('${aws-s3python-api;;key-words');
    expect(isResolved).not.toBeTruthy();
  });

  it('should not resolve(with args)', () => {
    const loader = new awsS3Loader();
    const { isResolved } = loader.canResolve(
      "${aws-s3(region='us-est-2'):python-api;;key-words"
    );
    expect(isResolved).not.toBeTruthy();
  });
});
