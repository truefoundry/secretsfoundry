import awsSecretsLoader from '../../src/loaders/AwsSecretsLoader';

describe('awsSecretsLoader', () => {
  const loader = new awsSecretsLoader();
  const validValues = [
    'aws-secrets:secret-1-key-usage',
    'aws-secrets(region=us-east-2):secret-1-key-usage',
  ];

  it('should return true on canResolve', () => {
    for (const value of validValues) {
      const isResolved = loader.canResolve(value);
      expect(isResolved).toBeTruthy();
    }
  });

  const invalidValues = [
    'aws-secretssecret-1-key-usage',
    'aws-secrets(region=us-east-4):secret;;-1-key-usage',
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
        passedValue: 'aws-secrets(region=us-east-2):secret-1-key-usage',
        expectedResult: 'secret-1-key-usage',
      },
      {
        passedValue: 'aws-secrets(region=us-east-1):secret-2-key-usage',
        expectedResult: 'secret-2-key-usage',
      },
    ];
    for (const value of values) {
      expect(await loader.resolve(value.passedValue)).toStrictEqual(
        value.expectedResult
      );
    }
  });
});
