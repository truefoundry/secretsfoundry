import awsSSMLoader from '../../src/loaders/AwsSSMLoader';
import '../setup/aws-sdk';

describe('awsSSMLoader', () => {
  const loader = new awsSSMLoader();

  it('should return true on canResolve', () => {
    const validValues = [
      'aws-ssm:ssm-key-uS1ge',
      'aws-ssm(region=us-east-2):ssm-key-uS1ge',
      'aws-ssm(decrypt=true):ssm-key-uS1ge',
      'aws-ssm(region=us-east-2,decrypt=true):ssm-key-uS1ge',
      'aws-ssm(:MO,69;(7Xs:K1=Fgn5L6/Zr6zg)-q)t1-t2,):-rda/yas_1/R3fD7.',
    ];
    for (const value of validValues) {
      const isResolved = loader.canResolve(value);
      expect(isResolved).toBeTruthy();
    }
  });

  it('should return false on canResolve', () => {
    const invalidValues = [
      '    ',
      'aws-ssm:',
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
