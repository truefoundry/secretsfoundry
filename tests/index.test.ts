import Utils from '../src/utils';

describe('ValidatesInput:', () => {
  it('should validate input(only command)', () => {
    const result = Utils.validateInput({ command: 'test' });
    expect(result).toBeTruthy();
  });

  it('should validate input(command + stage)', () => {
    const result = Utils.validateInput({ command: 'test', stage: 'dev' });
    expect(result).toBeTruthy();
  });

  it('should validate input(command + path)', () => {
    const result = Utils.validateInput({
      command: 'test',
      path: 'src',
    });
    expect(result).toBeTruthy();
  });

  it('should validate input(only script)', () => {
    const result = Utils.validateInput({
      script: 'test',
    });
    expect(result).toBeTruthy();
  });

  it('should validate input(script + stage)', () => {
    const result = Utils.validateInput({ script: 'test', stage: 'dev' });
    expect(result).toBeTruthy();
  });

  it('should validate input(script + path)', () => {
    const result = Utils.validateInput({
      script: 'test',
      path: 'src',
    });
    expect(result).toBeTruthy();
  });

  it('should fail(both command and script)', () => {
    const mockExit = jest.spyOn(process, 'exit').mockImplementation((code) => {
      throw new Error('process.exit: ' + code);
    });
    expect(() => {
      Utils.validateInput({ command: 'test', script: 'test' });
    }).toThrow();
    expect(mockExit).toHaveBeenCalledWith(-1);
    mockExit.mockRestore();
  });

  it('should fail(folder doesn\'t exist )', () => {
    const mockExit = jest.spyOn(process, 'exit').mockImplementation((code) => {
      throw new Error('process.exit: ' + code);
    });
    expect(() => {
      Utils.validateInput({ path: 'srt' });
    }).toThrow();
    expect(mockExit).toHaveBeenCalledWith(-1);
    mockExit.mockRestore();
  });
});

describe('GetScriptArgs:', () => {
  it('should pass', () => {
    const script = 'npm i && npm --version';
    const args = Utils.getScriptArgs(script);
    const result = process.platform === 'win32'
      ? ['cmd', '/C', script]
      : ['sh', '-c', script]
    expect(args).toEqual(result);
  });
});