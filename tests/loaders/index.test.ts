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
  ];

  it('should pass the values', () => {
    for (const value of validValues) {
      const result = loader.getArgsFromStr(value.passedValue);
      expect(result).toEqual(value.expectedResult);
    }
  });

  const invalidValues = [
    {
      passedValue: 'region=us-east-2"',
      expectedResult: { region: 'us-east-2', raw: 'true' },
    },
    {
      passedValue: 'region="us-east,2",day=today',
      expectedResult: { region: '"us-east,2"', date: 'today' },
    },
  ];

  it('should not pass the values', () => {
    for (const value of invalidValues) {
      const result = loader.getArgsFromStr(value.passedValue);
      expect(result).not.toEqual(value.expectedResult);
    }
  });
});
