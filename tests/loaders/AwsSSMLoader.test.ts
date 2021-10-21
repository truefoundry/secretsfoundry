import awsSSMLoader from '../../src/loaders/AwsSSMLoader';

describe('awsSSMLoader', () => {
  const loader = new awsSSMLoader();
  const validValues = [
    'aws-ssm:ssm-key-uS1ge',
    'aws-ssm(region=us-east-2):ssm-key-uS1ge',
    'aws-ssm(decrypt=true):ssm-key-uS1ge',
    'aws-ssm(region=us-east-2,decrypt=true):ssm-key-uS1ge',
  ];

  it('should return true on canResolve', () => {
    for (const value of validValues) {
      const isResolved = loader.canResolve(value);
      expect(isResolved).toBeTruthy();
    }
  });

  const invalidValues = [
    'aws-ss:ssm-key-uS1ge',
    'aws-ssm(region=asia-4):ssm-k@y-uS1ge',
    'aws-ssm(decrypt=1):ssm;;-key-uS1ge',
    'aws-ssm(region=us-east-2 decrypt=1)ssm-key-uS1ge',
  ];

  it('should return false on canResolve', () => {
    for (const value of invalidValues) {
      const isResolved = loader.canResolve(value);
      expect(isResolved).not.toBeTruthy();
    }
  });

  it('should return required value on resolve', async () => {
    const values = [
      {
        passedValue: 'aws-ssm(region=us-east-2,decrypt=true):ssm-key-uS1ge',
        expectedResult: 'ssm-key-uS1ge-true',
      },
      {
        passedValue: 'aws-ssm(region=us-east-2,decrypt=false):ssm-key-uS1ge',
        expectedResult: 'ssm-key-uS1ge-false',
      },
    ];
    for (const value of values) {
      expect(await loader.resolve(value.passedValue)).toStrictEqual(
        value.expectedResult
      );
    }
  });
});
