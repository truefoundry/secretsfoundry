import Loader from '../../src/loaders/loader';

class DummyLoader extends Loader {
  constructor() {
    super();
  }

  public async resolve(...args: string[]): Promise<string> {
    return `test`;
  }

  public canResolve(variable: string): boolean {
    return true;
  }
}

describe('getArgsFromStr', () => {
  it('should pass', () => {
    const loader = new DummyLoader();
    const result = loader.getArgsFromStr('region=us-east-2,raw=true');
    expect(result).toEqual({ region: 'us-east-2', raw: 'true' });
  });

  it('should not pass', () => {
    const loader = new DummyLoader();
    const result = loader.getArgsFromStr('region=us-east-2');
    expect(result).not.toEqual({ region: 'us-east-2', raw: 'true' });
  });
});
