import vaultLoader from '../../src/loaders/VaultLoader';

describe('vaultLoader', () => {
  it('should resolve', () => {
    const loader = new vaultLoader();
    const isResolved = loader.canResolve('vault:random-name');
    expect(isResolved).toBeTruthy();
  });

  it('should not resolve', () => {
    const loader = new vaultLoader();
    const isResolved = loader.canResolve('vaut:random-name');
    expect(isResolved).not.toBeTruthy();
  });
});
