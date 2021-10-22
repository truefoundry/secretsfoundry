import awsSSMLoader from '../../src/loaders/AwsSSMLoader';

describe('awsSSMLoader', () => {
  const loader = new awsSSMLoader();

  it('should return true on canResolve', () => {
    const validValues = [
      'aws-ssm:ssm-key-uS1ge',
      'aws-ssm(region=us-east-2):ssm-key-uS1ge',
      'aws-ssm(decrypt=true):ssm-key-uS1ge',
      'aws-ssm(region=us-east-2,decrypt=true):ssm-key-uS1ge',
      'aws-ssm(mpDY):dl5RR88py1b0.H',
      'aws-ssm:2FTKIIsn2QLSZ2ZaE0eU_EibPGDF_E6uAcmmOo0cNGPeuuEP/JkJOlz1WnL-TcflhNdV5x-q0qHUmVKxdAxsP5X5uCQlB',
      'aws-ssm:UIzMFG.WiHbq1S33atZ8tfr_Gf1Wl3dqfk',
      'aws-ssm(:MO,69jRB8(7Xs:K1Fgn5L6/Zr6zg)-q)yBn7FHM7tbu-R4bhlGOeaI6Xcqq8SawS787,):-9PzZhTBp3F0EXMLwAnztd9/MkT4f_7Spr75kt2s3g67jMYDeVbvidN8H8/R3fD7.',
      'aws-ssm():qhZduo/o79fxPZ/Oglnfy.DEeQ5BGZvQD2oTsXYyoE9-rXIUi-a29.B5K6nkFZsJ0Usd-uU.0',
      'aws-ssm(AcijcB):vS_eZlnhmn-Q9csaRM2i9DXa8nt9_G7qco4o.cHlr-.oqayI72ues5dSS',
      'aws-ssm(z;fr:V(N2a6r_W4iXF_nanLRe86/umDPtro2.lNf;LdItUlkWS0MI.7=f7cag)q;Jpf;mEB1r;Uu1y;):Uw3NS/jBgWuKbQSnjPd',
      'aws-ssm:lixynN4q5eozl2IWYxDrP0q9taGVRQahvn0IPNEAjTcrxUzMuLMtGr8BrU_qWclX',
      'aws-ssm:yM5/BUGlrH6L/S0kCkWCIl7h22.gAHH5fTcmNCC2eMCODgXf1-mWLhxR3gD_oyAJ5Y0CFVQ9b8pqggfdztgc1lHedOGYys854',
      'aws-ssm:PMWc_1ZSh./0e_NUNxofO5TVeeE8uiPNrLK/X/MhDq2NLmQwW3G4ScT3K5cYysiyp4tCrQTX',
    ];
    for (const value of validValues) {
      const isResolved = loader.canResolve(value);
      expect(isResolved).toBeTruthy();
    }
  });

  it('should return false on canResolve', () => {
    const invalidValues = [
      'aws-ss:ssm-key-uS1ge',
      'aws-ssm(region=asia-4):ssm-k@y-uS1ge',
      'aws-ssm(decrypt=1):ssm;;-key-uS1ge',
      'aws-ssm(region=us-east-2 decrypt=1)ssm-key-uS1ge',
      'aws-ssm(mpDY):dl5RR88py1b0@H',
      'aws-ssm(AcijcB):vS_eZlnhmn-Q9csaRM2i9DXa8nt9_G7qco4o.cHlr$$-.oqayI72ues5dSS',
      'aws-ssm(z;fr:V(N2a6r_W4iXF_nanLRe86/umDPtro2.lNf;LdItUlkWS0MI.7=f7cag)q;Jpf;mEB1r;Uu1{y;):Uw3NS/jBgWuKbQSnjPd',
    ];
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
      {
        passedValue: 'aws-ssm(mpDY):dl5RR88py1b0.H',
        expectedResult: 'dl5RR88py1b0.H-false',
      },
      {
        passedValue: 'aws-ssm:UIzMFG.WiHbq1S33atZ8tfr_Gf1Wl3dqfk',
        expectedResult: 'UIzMFG.WiHbq1S33atZ8tfr_Gf1Wl3dqfk-false',
      },
      {
        passedValue:
          'aws-ssm:yM5/BUGlrH6L/S0kCkWCIl7h22.gAHH5fTcmNCC2eMCODgXf1-mWLhxR3gD_oyAJ5Y0CFVQ9b8pqggfdztgc1lHedOGYys854',
        expectedResult:
          'yM5/BUGlrH6L/S0kCkWCIl7h22.gAHH5fTcmNCC2eMCODgXf1-mWLhxR3gD_oyAJ5Y0CFVQ9b8pqggfdztgc1lHedOGYys854-false',
      },
    ];
    for (const value of values) {
      expect(await loader.resolve(value.passedValue)).toStrictEqual(
        value.expectedResult
      );
    }
  });
});
