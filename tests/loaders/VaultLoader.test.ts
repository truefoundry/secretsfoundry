import vaultLoader from '../../src/loaders/VaultLoader';
import nodeVault from 'node-vault';
jest.mock('node-vault');

console.log(nodeVault)

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

  it('should resolve vault secrets', async () => {
    const loader = new vaultLoader();
    process.env.ROLE_ID = 'Role';
    process.env.SECRET_ID = 'Secret';
    expect(
      await loader.resolve(
        'vault(endpoint_url=someEndpoint):random-name'
      )
    ).toStrictEqual(JSON.stringify('Role-random-name'));
    process.env.VAULT_ENDPOINT_URL = 'someEndpoint'
    expect(
      await loader.resolve(
        'vault:random-name'
      )
    ).toStrictEqual(JSON.stringify('Role-random-name'))
  })
});
