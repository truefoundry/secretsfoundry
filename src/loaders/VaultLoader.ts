import Loader from '.';
import nodeVault from 'node-vault';
const vault = nodeVault({
  apiVersion: 'v1',
  endpoint: 'http://127.0.0.1:8200',
});

export default class vaultLoader implements Loader {
  public async loadData(vaultVariable: string) {
    const roleId = process.env.ROLE_ID;
    const secretId = process.env.SECRET_ID;
    // need to check regex for vaultVariable but not sure as of now
    const result = await vault.approleLogin({
      role_id: roleId,
      secret_id: secretId,
    });
    vault.token = result.auth.client_token;
    const data = await vault.read(vaultVariable);
    return JSON.stringify(data);
  }
}
