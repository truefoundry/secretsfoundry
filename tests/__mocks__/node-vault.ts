import nodeVault from 'node-vault';

class DummyNodeVault {
  options: nodeVault.VaultOptions;
  roleId: string | null = null;
  secretId: string | null = null;

  constructor(options?: nodeVault.VaultOptions) {
    this.options = options || {};
  }

  approleLogin(options?: nodeVault.Option): {
    auth: {client_token: string}
  } {
    if (!this.options.endpoint) {
      throw new Error('Endpoint is not defined');
    }
    this.roleId = options?.role_id || null;
    this.secretId = options?.secret_id || null;

    return {
      auth: {
        client_token: 'some_client_token'
      }
    }
  }

  read(key: string) {
    if (!this.roleId || !this.secretId) {
      throw new Error('User was not logged in.');
    }

    return `${this.roleId}-${key}`;
  }
}

jest
  .mock('node-vault', 
    () => (options: nodeVault.VaultOptions) => new DummyNodeVault(options)
  );

export default nodeVault;