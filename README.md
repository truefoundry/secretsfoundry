# Secretsfoundry

SecretsFoundry is a package to automatically fetch your environment variables
from different sources and secret managers. You can write the path to secret key in .env and
SecretsFoundry will automatically fetch it for you. It parses the `.env` or `.env.*` files
to automatically extract the values and provide them as environment variables to your
application.

## Prerequisites

`npm install npm@latest -g`

## Getting Started

- `npm install secretsfoundry --save`

- Create a `.env` file in your repository

```js
SIMPLE = "simple"

// Use the environment variables described earlier
VARIABLE = ${SIMPLE}

// Use variable defined in aws parameter store
AWS_SSM_VARIABLE = ${aws-ssm:/path/to/variable}

// Use variable defined in aws secrets manager
AWS_SECRETS_SECRET = ${aws-secret:/path/to/secret}

// Use value from S3
AWS_S3_VALUE = ${aws-s3:bucket/key}

// Use value from Hashicorp vault
VAULT_VALUE = ${vault:/path/to/secret}
```

- If you were earlier running your application using `node app.js`, use:

`secretsfoundry run --command "node app.js"`

`app.js` can now access all the variables using process.env

```js
SIMPLE = "hello"
VARIABLE = "hello"
AWS_SSM_VARIABLE = 'aws-ssm-variable'
AWS_SECRETS_SECRET = 'aws-secret-value'
AWS_S3_VALUE = 'aws-s3-value'
VAULT_VALUE = 'vault-decrypted-value'
```

SecretsFoundry currently provides support for the following sources:

1. AWS Parameter Store
2. AWS Secrets Manager
3. Hashicorp Vault
4. AWS S3

We will soon be extending support for GCP Secrets Engine and Azure Key Vault. If you need support
for other sources, reach out to us for support or send a PR.

## Format in env files

```js
SIMPLE = "simple"

// Use the environment variables described earlier
VARIABLE = ${SIMPLE}

// Use variable defined in aws parameter store
// Args: region, decrypt
// To use with args, ${aws-ssm(region=us-east-1):/path/to/variable}
AWS_SSM_VARIABLE = ${aws-ssm:/path/to/variable}

// Use variable defined in aws secrets manager
// Args: region
// To use with args, ${aws-secrets(region=us-east-1):/path/to/variable}
AWS_SECRETS_SECRET = ${aws-secrets:/path/to/secret}

// Use value from S3
// args: region
// To use with args, ${aws-s3(region=us-east-1):bucket/key}
AWS_S3_VALUE = ${aws-s3:bucket/key}

// Use value from Hashicorp vault
VAULT_VALUE = ${vault:/path/to/secret}
```

## Advanced Usage:

Each of the secrets loaders can be customized with a few arguments in format:

`${provider(args):key_name}`

### AWS Parameter Store

SecretsFoundry relies on getting aws credentials via environment variables or from ~/.aws directory.
It looks for the following environment variables:

```js
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
AWS_DEFAULT_REGION
```

Arguments (optional)

- **region:** Region in which value is to be looked for. Should be a valid AWS region
- **decrypt** If the value should be decrypted (default is false)

You can customise aws-ssm provider using:
`${aws-ssm(region=us-east-2,decrypt=true):/path/to/param`

### AWS Secrets Manager

AWS credentials are fetched in a similar way as AWS Parameter Store.

Arguments (optional)
- **region:** Region in which value is to be looked for.

You can customise aws-secrets provider using:
`${aws-secrets(region=us-east-2)`

### AWS S3

AWS credentials are fetched in a similar way as AWS Parameter Store

Arguments (optional)
- **region:** AWS Region to lookup the value

You can customise aws-secrets provider using:
`${aws-s3(region='us-east-2'):bucket/key`

### Hashicorp vault

VaultLoader loads the secret from HashiCorp's NodeVault We get the credentials for the vault from the environment variables The credentials required are as follows:
```js
VAULT_ROLE_ID
VAULT_SECRET_ID
VAULT_ENDPOINT_URL // can be left empty, if endpoint_url is passed as argument
```

Arguments (optional)
- **endpoint_url**: the url of the vault server, can be left empty if `VAULT_ENDPOINT_URL` is set accordingly

It accepts one parameter: 
- **secret_name**: the path to the secret in vault

You can customise the vault provider using:
`${vault(endpoint_url=<url>):<secret_name>}`

**NOTE**: NodeVault instace must be running, and the environment variables must be set.

You can refer to our [docs](https://abhichoudhary06.gitbook.io/secretsfoundry/) for more information.

# Contributing

We love our contributors! Please read our [Contributing Document](CONTRIBUTING.md) to learn how you can start working on the Framework yourself.

# License

Distributed under the [MIT License](./LICENSE.txt). See LICENSE.txt for more information.
