import Loader from '../../src/loaders/loader';

class DummyLoader extends Loader {
  constructor() {
    super();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async resolve(...args: string[]): Promise<string> {
    return 'test';
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public canResolve(variable: string): boolean {
    return true;
  }
}

describe('getArgsFromStr', () => {
  const loader = new DummyLoader();

  it('should pass the values', () => {
    const validValues = [
      {
        passedValue: '',
        expectedResult: {},
      },
      {
        passedValue: '     ',
        expectedResult: {},
      },
      {
        passedValue: 'test-arg=hello',
        expectedResult: { 'test-arg': 'hello' },
      },
      {
        passedValue: 'test-arg',
        expectedResult: { 'test-arg': undefined },
      },
      {
        passedValue: 'new="hello"',
        expectedResult: { new: '"hello"' },
      },
      {
        passedValue: 'region=us-east-2,raw=true',
        expectedResult: { region: 'us-east-2', raw: 'true' },
      },
      {
        passedValue:
          'link=https://stackoverflow.com/questions/47754777/jest-how-to-test-for-object-keys-and-values,second=not-so@tast-;kajarg',
        expectedResult: {
          link: 'https://stackoverflow.com/questions/47754777/jest-how-to-test-for-object-keys-and-values',
          second: 'not-so@tast-;kajarg',
        },
      },
      {
        passedValue:
          'name=yM5/BUGlrH6L/S0kCkWCIl7h22.gAHH5fTcmNCC2eMCODgXf1-mWLhxR3gD_oyAJ5Y0CFVQ9b8pqggfdztgc1lHedOGYys854',
        expectedResult: {
          name: 'yM5/BUGlrH6L/S0kCkWCIl7h22.gAHH5fTcmNCC2eMCODgXf1-mWLhxR3gD_oyAJ5Y0CFVQ9b8pqggfdztgc1lHedOGYys854',
        },
      },
    ];
    for (const value of validValues) {
      const result = loader.getArgsFromStr(value.passedValue);
      expect(result).toEqual(value.expectedResult);
    }
  });

  it('should not pass the values', () => {
    const invalidValues = [
      {
        passedValue: 'region=us-east-2"',
        expectedResult: { region: 'us-east-2', raw: 'true' },
      },
      {
        passedValue: 'region="us-east,2",day=today',
        expectedResult: { region: '"us-east,2"', date: 'today' },
      },
      {
        passedValue:
          "s3=VRx,rm4nf/)4rmgi VRCMg+XY?F'S43P&)e!H7]^Y0Mu,0&z&^SPoutAB)t[:",
        expectedResult: {
          s3: "VRx,rm4nf/)4rmgi VRCMg+XY?F'S43P&)e!H7]^Y0Mu,0&z&^SPoutAB)t[:",
        },
      },
    ];
    for (const value of invalidValues) {
      const result = loader.getArgsFromStr(value.passedValue);
      expect(result).not.toEqual(value.expectedResult);
    }
  });
});
