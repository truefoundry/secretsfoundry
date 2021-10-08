import Loader from './loader';
import nodeVault from 'node-vault';
const vault = nodeVault({
  apiVersion: 'v1',
  endpoint: 'http://127.0.0.1:8200',
});

/**
 * VaultLoader loads the secret from HashiCorp's NodeVault
 * We get the credentials for the vault from the environment variables
 * The credentials required are as follows:
 * - VAULT_ROLE_ID
 * - VAULT_SECRET_ID
 *
 * It accepts one param:
 * path: the path to the secret in vault
 *
 * Note: The vault server must be running
 */

export default class VaultLoader extends Loader {
  private static PATTERN = /^vault(\((.*)?\))?:([a-zA-Z0-9_.\-/]+)/;

  canResolve(value: string): boolean {
    return value.match(VaultLoader.PATTERN) !== null;
  }

  public async resolve(vaultVariable: string): Promise<string> {
    const groups = vaultVariable.match(VaultLoader.PATTERN);
    if (groups === null) {
      throw new Error(
        'AwsSSMLoader cannot parse the variable name. This should never happen \
      since client is supposed to be calling canResolve first'
      );
    }
    const secretName = groups[2]; // name of the vault secret
    // TODO: Keep endpoint as args or env variable (We should support both)
    // need to check regex for secretName but not sure as of now
    const roleId = process.env.ROLE_ID;
    const secretId = process.env.SECRET_ID;
    const nodeVault = await vault.approleLogin({
      role_id: roleId,
      secret_id: secretId,
    });
    vault.token = nodeVault.auth.client_token;
    const data = await vault.read(secretName);
    return JSON.stringify(data);
  }
}
