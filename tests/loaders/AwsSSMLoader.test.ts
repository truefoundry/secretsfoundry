import { awsSSMLoader } from '../../src/loaders';

describe('awsSSMLoader', () => {
  it('should resolve(without args)', () => {
    const loader = new awsSSMLoader();
    const { isResolved } = loader.canResolve(
      '${aws-ssm:/meetcolab/frontend/stringlist'
    );
    expect(isResolved).toBeTruthy();
  });

  it('should resolve(with arg region)', () => {
    const loader = new awsSSMLoader();
    const { isResolved } = loader.canResolve(
      "${aws-ssm(region='us-east-2'):/meetcolab/frontend/stringlist"
    );
    expect(isResolved).toBeTruthy();
  });

  it('should resolve(with arg decrypt)', () => {
    const loader = new awsSSMLoader();
    const { isResolved } = loader.canResolve(
      "${aws-ssm(decrypt='true'):/meetcolab/frontend/stringlist"
    );
    expect(isResolved).toBeTruthy();
  });

  it('should resolve(with args region and decrypt)', () => {
    const loader = new awsSSMLoader();
    const { isResolved } = loader.canResolve(
      "${aws-ssm(region='us-east-2', decrypt='true'):/meetcolab/frontend/stringlist"
    );
    expect(isResolved).toBeTruthy();
  });

  it('should not resolve(without args)', () => {
    const loader = new awsSSMLoader();
    const { isResolved } = loader.canResolve(
      '${aws-ss:/meetcolab/frontend/stringlist'
    );
    expect(isResolved).not.toBeTruthy();
  });

  it('should not resolve(with arg region)', () => {
    const loader = new awsSSMLoader();
    const { isResolved } = loader.canResolve(
      "${aws-ssm(region='asia-4'):/meetcolab/frontend/stringlist"
    );
    expect(isResolved).not.toBeTruthy();
  });

  it('should not resolve(with arg decrypt)', () => {
    const loader = new awsSSMLoader();
    const { isResolved } = loader.canResolve(
      "${aws-ssm(decrypt='1'):/meetcolab/frontend/stringlist"
    );
    expect(isResolved).not.toBeTruthy();
  });

  it('should not resolve(with both arguments)', () => {
    const loader = new awsSSMLoader();
    const { isResolved } = loader.canResolve(
      "${aws-ssm(region='us-east-2' decrypt='1'):/meetcolab/frontend/stringlist"
    );
    expect(isResolved).not.toBeTruthy();
  });
});
