import Loader from './loader';

import { SecretManagerServiceClient } from '@google-cloud/secret-manager';

/**
 * GoogleSecretsLoader loads the secret from Google Secrets Manager.
 * This loader accepts pattern of the format
 * gcp-secrets:key-to-secret-version
 *
 * Requirements:
 *
 * Authenticate requests to GCP using the environment variables
 * GOOGLE_APPLICATION_CREDENTIALS
 *
 * Usage: export GOOGLE_APPLICATION_CREDENTIALS=KEY_PATH
 * Replace KEY_PATH with the path of the JSON file that contains your service account key.
 *
 */
export default class GoogleSecretsLoader extends Loader {
  private static PATTERN =
    /^gcp-secrets(\(([:a-zA-Z0-9_;(=),\\.\-/]*)?\))?:([a-zA-Z0-9_.\-/]+)$/;

  public canResolve(value: string): boolean {
    return value.match(GoogleSecretsLoader.PATTERN) !== null;
  }

  public async resolve(secretsVariable: string): Promise<string> {
    const groups = secretsVariable.match(GoogleSecretsLoader.PATTERN);
    if (groups === null) {
      throw new Error(
        'GoogleSecretsLoader cannot parse the variable name. This should never happen \
      since client is supposed to be calling canResolve first'
      );
    }

    const secretName = groups[3]; // path to param

    const client = new SecretManagerServiceClient();
    const [secret] = await client.accessSecretVersion({
      name: secretName,
    }, );
    return secret.payload?.data?.toString() as string;
  }
}
