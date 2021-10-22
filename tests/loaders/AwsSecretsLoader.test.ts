import awsSecretsLoader from '../../src/loaders/AwsSecretsLoader';

describe('awsSecretsLoader', () => {
  const loader = new awsSecretsLoader();

  it('should return true on canResolve', () => {
    const validValues = [
      'aws-secrets:secret-1-key-usage',
      'aws-secrets(region=us-east-2):secret-1-key-usage',
      'aws-secrets():9QMmV.-ssfIEOcg40n5sj-5z8-NZaNwcu4/AxalEtxU1drm61NoFizkh8C-HjcrBG1vszB5PKlY5z-_06Vf6KVZ',
      'aws-secrets(as)up=nNG-sEt==qjHS9=f(;,hveF_3;nmn//4N7:LQT):./7N.a/b',
    ];
    for (const value of validValues) {
      const isResolved = loader.canResolve(value);
      expect(isResolved).toBeTruthy();
    }
  });

  it('should return false on canResolve', () => {
    const invalidValues = [
      'aws-secretssecret-1-key-usage',
      'aws-secrets(region=us-east-4):secret;;-1-key-usage',
      'aws-secrets():aajksf12-@asmc2',
      'aws-secrets():4-9Hr0u{d/zQnV2C6jANpNWu_p0q8o7XV7Fye4dXr0MVD_0zrONh5QF6_.yLF_G/JhD.RACbeq7O0b-ax90fgM6XnM-x4/',
      'aws-secrets():hr{}asd;',
    ];
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
      {
        passedValue: 'aws-secrets:WU6n_krLYPWnko5Bo',
        expectedResult: 'WU6n_krLYPWnko5Bo',
      },
      {
        passedValue:
          'aws-secrets():4-9Hr0udzQnV2C6jANpNWu_p0q8o7XV7Fye4dXr0MVD_0zrONh5QF6_.yLF_GJhD.RACbeq7O0b-ax90fgM6XnM-x4',
        expectedResult:
          '4-9Hr0udzQnV2C6jANpNWu_p0q8o7XV7Fye4dXr0MVD_0zrONh5QF6_.yLF_GJhD.RACbeq7O0b-ax90fgM6XnM-x4',
      },
      {
        passedValue:
          'aws-secrets():9QMmV.-ssfIEOcg40n5sj-5z8-NZaNwc.u4Ax.alEtxU1drm61NoFizkh8C-HjcrBG1.vszB5PKlY5z/-_06Vf6KVZ/',
        expectedResult:
          '9QMmV.-ssfIEOcg40n5sj-5z8-NZaNwc.u4Ax.alEtxU1drm61NoFizkh8C-HjcrBG1.vszB5PKlY5z/-_06Vf6KVZ/',
      },
    ];
    for (const value of values) {
      expect(await loader.resolve(value.passedValue)).toStrictEqual(
        value.expectedResult
      );
    }
  });
});
