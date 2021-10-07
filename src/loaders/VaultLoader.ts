import Loader from '.';
import nodeVault from 'node-vault';
const vault = nodeVault({
  apiVersion: 'v1',
  endpoint: 'http://127.0.0.1:8200',
});

export default class VaultLoader extends Loader {
  private static PATTERN = /^vault(\((.*)?\))?:([a-zA-Z0-9_.\-\/]+)/;

  static canResolve(value: string): boolean {
    if (value.match(this.PATTERN) !== null) {
      return false;
    }
    return true;
  }

  public async resolveVariable(vaultVariable: string): Promise<string> {
    const groups = vaultVariable.match(VaultLoader.PATTERN);
    if (groups === null) {
      throw new Error(
        'AwsSSMLoader cannot parse the variable name. This should never happen \
      since client is supposed to be calling canResolve first'
      );
    }
    const secretName = groups[2]; // name of the vault secret

    const roleId = process.env.ROLE_ID;
    const secretId = process.env.SECRET_ID;
    // need to check regex for vaultVariable but not sure as of now
    const result = await vault.approleLogin({
      role_id: roleId,
      secret_id: secretId,
    });

    vault.token = result.auth.client_token;
    const data = await vault.read(secretName);
    return JSON.stringify(data);
  }
}
