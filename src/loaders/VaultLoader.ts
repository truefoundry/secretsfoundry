import Loader from './loader';
import nodeVault from 'node-vault';

/**
 * VaultLoader loads the secret from HashiCorp's NodeVault
 * We get the credentials for the vault from the environment variables
 * The credentials required are as follows:
 * - VAULT_ROLE_ID
 * - VAULT_SECRET_ID
 * - VAULT_ENDPOINT_URL, can be left empty, if endpoint_url is passed as argument
 * 
 * It accepts one param:
 * path: the path to the secret in vault
 * endpoint_url: the url of the vault server, can be left empty if VAULT_ENDPOINT_URL is set 
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
    let secretName: string, vaultEndpoint, args: Record<string, string>;
    if (groups.length === 4) {
      args = this.getArgsFromStr(groups[2]);
      if (args.endpoint_url) {
        vaultEndpoint = args.endpoint_url;
      }
      secretName = groups[3];
    } else {
      secretName = groups[2];
    }
    if (!vaultEndpoint) {
      console.log(process.env.VAULT_ENDPOINT_URL);
      if ('VAULT_ENDPOINT_URL' in process.env)
        vaultEndpoint = process.env.VAULT_ENDPOINT_URL;
      else
        throw new Error('Vault endpoint url is not passed through args, nor set in env');
    }
    const vault = nodeVault({
      apiVersion: 'v1',
      endpoint: vaultEndpoint,
    });
    const roleId = process.env.ROLE_ID;
    const secretId = process.env.SECRET_ID;
    const vaultLogin = await vault.approleLogin({
      role_id: roleId,
      secret_id: secretId,
    });
    vault.token = vaultLogin.auth.client_token;
    const data = await vault.read(secretName);
    return JSON.stringify(data);
  }
}
