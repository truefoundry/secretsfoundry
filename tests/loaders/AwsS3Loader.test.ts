import awsS3Loader from '../../src/loaders/AwsS3Loader';
import '../setup/aws-sdk';

describe('AwsS3Loader', () => {
  const loader = new awsS3Loader();

  it('should return true on canResolve', () => {
    const validValues = [
      'aws-s3:python/testing',
      'aws-s3(region=us-east-2):python/testing',
      "aws-s3:=VRx,rm4nf/)4rmgi VRCMg+XY?F'S43P&)e!H7]^Y0Mu,0&z&^SPoutAB)t[:",
      "aws-s3(;V=E.()f):a/J[#>Nt~$a=&.ZSc;TY%*[@1}^>F%5-'!$FPD]>}AEE{='b`~rLNF)",
    ];
    for (const value of validValues) {
      const isResolved = loader.canResolve(value);
      expect(isResolved).toBeTruthy();
    }
  });

  it('should return false on canResolve', () => {
    const invalidValues = [
      '    ',
      'aws-s3:',
      'aws-s3python-api-key-words',
      'aws-s3(region=us-est-2):python-api;;key-words',
      'AWS-S3:random-name',
      'aws-s3(region="us-east-2"):1_2_23/onlynumericalfront',
      'aws-s3:/3*xUbA}`qTx2u_Xaem*',
    ];
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
      {
        passedValue:
          "aws-s3:=VRx,rm4nf/)4rmgi VRCMg+XY?F'S43P&)e!H7]^Y0Mu,0&z&^SPoutAB)t[:",
        expectedResult:
          "=VRx,rm4nf-)4rmgi VRCMg+XY?F'S43P&)e!H7]^Y0Mu,0&z&^SPoutAB)t[:",
      },
      {
        passedValue:
          "aws-s3(dIrSDoASYMdac2U_JMzYjp-pl8):co/vVd^RG9:('FvF5t$*M K:[h[+wmUpN?8<ZO'x(!@*t.S:",
        expectedResult: "co-vVd^RG9:('FvF5t$*M K:[h[+wmUpN?8<ZO'x(!@*t.S:",
      },
    ];
    for (const value of values) {
      expect(await loader.resolve(value.passedValue)).toStrictEqual(
        value.expectedResult
      );
    }
  });
});
