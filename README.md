# Secretsfoundry

SecretsFoundry is a package to automatically fetch your environment variables
from different sources and secret managers. You can write the path to secret key in .env and
SecretsFoundry will automatically fetch it for you. It parses the `.env` or `.env.*` files
to automatically extract the values and provide them as environment variables to your
application.

You can refer to our [docs](https://abhichoudhary06.gitbook.io/secretsfoundry/) for more information.

## Prerequisites

`npm install npm@latest -g`

## Getting Started

- `npm install secretsfoundry --save`

- Create a `.env` file in your repository

```js
SIMPLE = "simple"

// Use the environment variables described earlier
VARIABLE = ${SIMPLE}
```

> secretsfoundry run

The output should be:

```
SIMPLE = "simple"
VARIABLE = "simple"
```

Now lets add a parameter to AWS Parameter Store using:

> aws ssm put-parameter --name /staging/example/server/GOOGLE_API_KEY --value google_api_key --type "String"

Add the variable to .env:

```js
SIMPLE = "simple"

// Use the environment variables described earlier
VARIABLE = ${SIMPLE}

// Use variable defined in aws parameter store
GOOGLE_API_KEY = ${aws-ssm:/staging/example/server/GOOGLE_API_KEY}

```

> secretsfoundry run

The output should be:

```
SIMPLE = "simple"
VARIABLE = "simple"
GOOGLE_API_KEY = google_api_key
```

You can similarily store your variables in AWS S3, AWS Secrets Manager and Hashicorp Vault.
To use them as environment variables, you can simple use:

```js

SIMPLE = "simple"

// Use the environment variables described earlier
VARIABLE = ${SIMPLE}

// Use variable defined in aws secrets manager
AWS_SECRETS_SECRET = ${aws-secret:/path/to/secret}

// Use value from S3
AWS_S3_VALUE = ${aws-s3:bucket/key}

// Use value from Hashicorp vault
VAULT_VALUE = ${vault:/path/to/secret}

```

- If you were earlier running your application using `node app.js`, use:

`secretsfoundry run --script "node app.js"`

`app.js` can now access all the variables using process.env

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

Refer to our [docs](https://github.com/innoavator/secretsfoundry) to see how to customise loaders with arguments and integrate with docker.

# Contributing

We love our contributors! Please read our [Contributing Document](CONTRIBUTING.md) to learn how you can start working on the Framework yourself.

# License

Distributed under the [MIT License](./LICENSE.txt). See LICENSE.txt for more information.
