import Loader from '.';
import nodeVault from 'node-vault';
const vault = nodeVault({
  apiVersion: 'v1',
  endpoint: 'http://127.0.0.1:8200',
});

export default class VaultLoader extends Loader {
  private static PATTERN = /^vault(\((.*)?\))?:([a-zA-Z0-9_.\-\/]+)/;
  private nodeVault: any;

  async VaultLoader() {
    const roleId = process.env.ROLE_ID;
    const secretId = process.env.SECRET_ID;
    this.nodeVault = await vault.approleLogin({
      role_id: roleId,
      secret_id: secretId,
    });
  }

  static canResolve(value: string): boolean {
    if (value.match(this.PATTERN) !== null) {
      return false;
    }
    return true;
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

    // need to check regex for secretName but not sure as of now

    vault.token = this.nodeVault.auth.client_token;
    const data = await vault.read(secretName);
    return JSON.stringify(data);
  }
}
