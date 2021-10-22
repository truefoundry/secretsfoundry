import awsS3Loader from '../../src/loaders/AwsS3Loader';

describe('AwsS3Loader', () => {
  const loader = new awsS3Loader();

  it('should return true on canResolve', () => {
    const validValues = [
      'aws-s3:python/testing',
      'aws-s3(region=us-east-2):python/testing',
      'aws-s3:multii/slash/work',
      'aws-s3(region=us-east-2):1_2_23/onlynumericalfront',
      'aws-s3:question-mark/hello',
      "aws-s3:with/'quotes/",
      "aws-s3:=VRx,rm4nf/)4rmgi VRCMg+XY?F'S43P&)e!H7]^Y0Mu,0&z&^SPoutAB)t[:",
      'aws-s3:yLmeSzAc-MhDs8HIVN/Wpy/o3)2hS=v)7,RBSvpF37rBVHzGUt)(dlj7/%Q6',
      "aws-s3(;VeU5PK=VbVZbrAq0A.hQ00Pp=E.VgMPqpbr0weL()f):a/J[#va>Nt0~$a=&.ZSc;TY[@1}qjzFy^>F%5Bi-1lI3B'!i1qtn$FPD]>Ap8^,AEE=HRzmxFd9'b`Km7a~rLNF)gW",
      "aws-s3(dIrSDoASYMdac2U_JMzYjp-pl8):co/vVd^RG9:('FvF5t$*M K:[h[+wmUpN?8<ZO'x(!@*t.S:",
      'aws-s3(Mj:2=-bX=-tkQKkl8gDd2NL8meVprKKC0JyQ0v7L6r1FSk5rrCCUc7)K0KmsJT2Gd:8yeMAPrRyYE8F68kgM9U,jLYKlea):)oJ,:iOGW9u/[AI,7`Y/V=1=I.r{h<Y2KXyYp',
    ];
    for (const value of validValues) {
      const isResolved = loader.canResolve(value);
      expect(isResolved).toBeTruthy();
    }
  });

  it('should return false on canResolve', () => {
    const invalidValues = [
      'aws-s3python-api-key-words',
      'aws-s3(region=us-est-2):python-api;;key-words',
      'AWS-S3:random-name',
      'aws-s3(region="us-east-2"):1_2_23/onlynumericalfront',
      'aws-s3:/3*xUbA}`qTx2u_Xaem*',
      "aws-s3:/L91i<$ce7 }S@]`v&OGt-TwSC@wY7:dcZWtv317Svb'Q{gdoI)JSZ#F[SwjEe*27vpa<;!%hR=j;>iWeG<D[b'./",
      'aws-s3:/{4NbhN@km`u}',
      "aws-s3(;VeU5PK=VbVZbrAq0A.hQ00Pp=E.VgMPqpbr0weL()f):/J[#va>Nt0~$a=&.ZSc;TY[@1}qjzFy^>F%5Bi-1lI3B'!i1qtn$FPD]>Ap8^,AEE=HRzmxFd9'b`Km7a~rLNF)gW",
      'aws-s3:/ V/Q q^uG.5.uT@Pfq0G fY6kP&NYf/A7.QVmwxWOs_7F~=f/&iAk^twf%,=qwp[',
      'aws-s3(oIUCQ5xK/I_fQD-cgXP/v\x4b;Hzg6uUViprjqEv2lZHdxVUuwd;oP;aGagZO.):/(2u-^L$kNfd#',
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
