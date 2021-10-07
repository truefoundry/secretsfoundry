import { SecretsFoundry } from '../src/SecretsFoundry';

describe('SecretsFoundry', () => {
  it('should resolve(without args)', () => {
    const foundry = new SecretsFoundry();
    const { isResolved } = loader.canResolve('${aws-ssm:ssm-key-uS1ge');
    expect(isResolved).toBeTruthy();
  });
});
