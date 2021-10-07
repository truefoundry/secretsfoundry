import { awsS3Loader } from '../../src/loaders';

describe('AwsS3Loader', () => {
  it('should resolve(without args)', () => {
    const loader = new awsS3Loader();
    // colons for now, should be removed as required
    const { isResolved } = loader.canResolve(
      '${aws-s3:aws-python-rest-api-dev-serverlessdeploymentbucke-9uodbgcd6tb3;;serverless/aws-python-rest-api/dev/1631258288627-2021-09-10T07:18:08.627Z/compiled-cloudformation-template.json'
    );
    expect(isResolved).toBeTruthy();
  });

  it('should resolve(with args)', () => {
    const loader = new awsS3Loader();
    const { isResolved } = loader.canResolve(
      "${aws-s3(region='us-east-2'):aws-python-rest-api-dev-serverlessdeploymentbucke-9uodbgcd6tb3;;serverless/aws-python-rest-api/dev/1631258288627-2021-09-10T07:18:08.627Z/compiled-cloudformation-template.json"
    );
    expect(isResolved).toBeTruthy();
  });

  it('should not resolve(without args)', () => {
    const loader = new awsS3Loader();
    const { isResolved } = loader.canResolve(
      '${aws-s3aws-python-rest-api-dev-serverlessdeploymentbucke-9uodbgcd6tb3;;serverless/aws-python-rest-api/dev/1631258288627-2021-09-10T07:18:08.627Z/compiled-cloudformation-template.json'
    );
    expect(isResolved).not.toBeTruthy();
  });

  it('should not resolve(with args)', () => {
    const loader = new awsS3Loader();
    const { isResolved } = loader.canResolve(
      "${aws-s3(region='us-est-2'):aws-python-rest-api-dev-serverlessdeploymentbucke-9uodbgcd6tb3;;serverless/aws-python-rest-api/dev/1631258288627-2021-09-10T07:18:08.627Z/compiled-cloudformation-template.json"
    );
    expect(isResolved).not.toBeTruthy();
  });
});
