---
description: https://www.vaultproject.io/
---

# Hashicorp Vault

VaultLoader loads the secret from HashiCorp's Vault. We get the credentials for the vault from the environment variables. The credentials required are as follows:

```javascript
VAULT_ROLE_ID
VAULT_SECRET_ID
VAULT_ENDPOINT_URL // can be left empty, if endpoint_url is passed as argument
```

## Usage

```
VARIABLE=${vault(endpoint_url=<url>):<secret-name>}
```

## **Syntax Terms Explanation**

**vault:** Tells that provider is vault and to load data from NodeVault.

**():** Parameters for vault. Currently, a single paramater is accepted:

* **endpoint_url:** endpoint url where the NodeVault server is running. If not passed, `VAULT_ENDPOINT_URL` environment variable will be taken. If both are not set, error will be thrown. If both, the environment variable is set and the `endpoint_url` is passed, the `endpoint_url` will take precedence.

**secret-name:** The key used for fetching the object details.
