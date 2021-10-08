import Utils, { Options } from '../src/utils';

describe('ValidatesInput:', () => {
  const options: Options = {
    stage: undefined,
    command: 'test',
    script: undefined,
    path: undefined,
  };
  it('should validate input(only command)', () => {
    const result = Utils.validateInput(options);
    expect(result).toBeTruthy();
  });

  options.stage = 'dev';
  it('should validate input(command + stage)', () => {
    const result = Utils.validateInput(options);
    expect(result).toBeTruthy();
  });

  options.path = 'src';
  options.stage = undefined;
  it('should validate input(command + path)', () => {
    const result = Utils.validateInput(options);
    expect(result).toBeTruthy();
  });

  options.script = 'test';
  options.command = undefined;
  options.path = undefined;
  it('should validate input(only script)', () => {
    const result = Utils.validateInput(options);
    expect(result).toBeTruthy();
  });

  options.stage = 'dev';
  it('should validate input(command + stage)', () => {
    const result = Utils.validateInput(options);
    expect(result).toBeTruthy();
  });

  options.path = 'src/utils';
  options.stage = undefined;
  it('should validate input(script + path)', () => {
    const result = Utils.validateInput(options);
    expect(result).toBeTruthy();
  });
});

describe('GetScriptArgs:', () => {
  it('should pass', () => {
    const script = 'npm i && npm --version';
    const args = Utils.getScriptArgs(script);
    if (process.platform === 'win32') {
      expect(args[0]).toEqual('cmd');
      expect(args[1]).toEqual('/C');
      expect(args[2]).toEqual(script);
    } else {
      expect(args[1]).toEqual('-c');
      expect(args[2]).toEqual(script);
    }
  });
});
