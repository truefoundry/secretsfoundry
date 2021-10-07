# Secretsfoundry

SecretsFoundry is a package to automatically fetch your environment variables
from different sources and secret managers. You can write the path to secret key in .env and
SecretsFoundry will automatically fetch it for you. It parses the .env or .env.\* files
to automatically extract the values and provide them as environment variables to your
application.

## Prerequisites

`npm install npm@latest -g`

## Getting Started

- `npm install secretsfoundry --save`

- Create a .env file in your repository

```
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

- If you were earlier running your application using node app.js, use:

`secretsfoundry run --command "node app.js"`

app.js can now access all the variables using process.env

```
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

```
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

## Advanced Usage:

Each of the secrets loaders can be customized with a few arguments in format:

`${provider(args):key_name}`

### AWS Parameter Store

SecretsFoundry relies on getting aws credentials via environment variables or from ~/.aws directory.
It looks for the following environment variables:

```
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
AWS_DEFAULT_REGION
```

You can customise aws-ssm provider using:
`${aws-ssm(region='us-east-2', decrypt="true")`

SecretsFoundry decrypts the key by default. Pass decrypt=false to get the raw value.

**region:** Region in which value is to be looked for. Must follow the following REGEX `/^(us(-gov)?|ap|ca|cn|eu|sa)-(central|(north|south)?(east|west)?)-\d?/`

**name:** Name of the secret to be used. Must follow the REGEX `/^[\w-]+$/`

### AWS Secrets Manager

AWS credentials are fetched in a similar way as AWS Parameter Store. You can customise aws-secrets provider using:
`${aws-secrets(region='us-east-2', decrypt="true")`

**region:** Region in which value is to be looked for. Must follow the following REGEX `/^(us(-gov)?|ap|ca|cn|eu|sa)-(central|(north|south)?(east|west)?)-\d?/`

**name:** Name of the secret to be used. Must follow the REGEX `/^[\w\/-._]+$/`

**withDecryption:** Tells whether the secret value should be decrypted or not. Can only be either `true` or `false`

### AWS S3

AWS credentials are fetched in a similar way as AWS Parameter Store
`${aws-s3(region='us-east-2')`

### Hashicorp vault

TODO: Fill up

```text
VARIABLE=${vault:<secret_name>}
```

### Parameters

**vault**: tells loader is of type vault.

**secret_name**: name of the secret to be used.

**NOTE**: Currently, one needs to export root_id and secret_id as `ROOT_ID` and `SECRET_ID` to make vault loader work.

# Contributing

We love our contributors! Please read our [Contributing Document](CONTRIBUTING.md) to learn how you can start working on the Framework yourself.

# License

Distributed under the [MIT License](./LICENSE.txt). See LICENSE.txt for more information.
