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
  it('should pass(empty string)', () => {
    const loader = new DummyLoader();
    const result = loader.getArgsFromStr('');
    expect(result).toEqual({});
  });

  it('should pass(empty string with spaces)', () => {
    const loader = new DummyLoader();
    const result = loader.getArgsFromStr('   ');
    expect(result).toEqual({});
  });

  it('should pass(single arg)', () => {
    const loader = new DummyLoader();
    const result = loader.getArgsFromStr('test-arg=hello');
    expect(result).toEqual({ 'test-arg': 'hello' });
  });

  it('should pass(single arg with no value)', () => {
    const loader = new DummyLoader();
    const result = loader.getArgsFromStr('test-arg');
    expect(result).toEqual({ 'test-arg': undefined });
  });

  it('should pass(single arg value with quotes)', () => {
    const loader = new DummyLoader();
    const result = loader.getArgsFromStr('new="hello"');
    expect(result).toEqual({ new: '"hello"' });
  });

  it('should pass(multi-arg)', () => {
    const loader = new DummyLoader();
    const result = loader.getArgsFromStr('region=us-east-2,raw=true');
    expect(result).toEqual({ region: 'us-east-2', raw: 'true' });
  });

  it('should pass(multi-arg with values containing non aplha-numeric characters)', () => {
    const loader = new DummyLoader();
    const result = loader.getArgsFromStr(
      'link=https://stackoverflow.com/questions/47754777/jest-how-to-test-for-object-keys-and-values,second=not-so@tast-;kajarg'
    );
    expect(result).toEqual({
      link: 'https://stackoverflow.com/questions/47754777/jest-how-to-test-for-object-keys-and-values',
      second: 'not-so@tast-;kajarg',
    });
  });

  it('should not pass', () => {
    const loader = new DummyLoader();
    const result = loader.getArgsFromStr('region=us-east-2');
    expect(result).not.toEqual({ region: 'us-east-2', raw: 'true' });
  });

  it('should not pass(comma in values)', () => {
    const loader = new DummyLoader();
    const result = loader.getArgsFromStr('region="us-east,2",day=today');
    expect(result).not.toEqual({ region: '"us-east,2"', date: 'today' });
  });
});
