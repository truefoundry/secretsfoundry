import vaultLoader from '../../src/loaders/VaultLoader';

describe('vaultLoader', () => {
  const loader = new vaultLoader();
  const validValues = ['vault:random-name'];
  it('should return true on canResolve', () => {
    for (const value of validValues) {
      const isResolved = loader.canResolve(value);
      expect(isResolved).toBeTruthy();
    }
  });

  const invalidValues = ['vaut:random-name'];

  it('should return false on canResolve', () => {
    for (const value of invalidValues) {
      const isResolved = loader.canResolve(value);
      expect(isResolved).not.toBeTruthy();
    }
  });
});
