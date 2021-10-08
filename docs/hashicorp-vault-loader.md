---
description: 'https://www.vaultproject.io/'
---

# HashiCorp Vault

VaultLoader loads the secret from HashiCorp's NodeVault.

## Usage

```text
VARIABLE=${vault(endpoint_url=<url>):<secret-name>}
```

## **Syntax Terms Explanation**

**vault:** Tells that provider is vault and to load data from NodeVault.

**\(\):** Parameters for vault. Currently, a single paramater is accepted:  
- **endpoint_url:** endpoint url where the NodeVault server is running. If not passed, `VAULT_ENDPOINT_URL` environment variable will be taken. If both are not set, error will be thrown 

**secret-name:** The key used for fetching the object details.

Hence, the complete variable **must follow** the REGEX: `/^vault(\((.*)?\))?:([a-zA-Z0-9_.\-/]+)/`

