import awsS3Loader from '../../src/loaders/AwsS3Loader';

describe('AwsS3Loader', () => {
  const loader = new awsS3Loader();
  const validValues = [
    'aws-s3:python/testing',
    'aws-s3(region=us-east-2):python/testing',
  ];

  it('should return true on canResolve', () => {
    for (const value of validValues) {
      const isResolved = loader.canResolve(value);
      expect(isResolved).toBeTruthy();
    }
  });

  const invalidValues = [
    'aws-s3python-api-key-words',
    'aws-s3(region=us-est-2):python-api;;key-words',
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
        passedValue: 'aws-s3(region=us-east-2):python/testing',
        expectedResult: 'python-testing',
      },
      {
        passedValue: 'aws-s3(region=us-east-2):javascript/testing',
        expectedResult: 'javascript-testing',
      },
    ];
    for (const value of values) {
      expect(await loader.resolve(value.passedValue)).toStrictEqual(
        value.expectedResult
      );
    }
  });
});
