---
description: Run a full demo of secretsfoundry
---

# Getting Started

[Install](getting-started.md) Secretsfoundry

Create a `.env` file in your repository

```
SIMPLE = "simple"

// Use the environment variables described earlier
VARIABLE = ${SIMPLE}
```

&#x20;\> secretsfoundry run

The output should be something like:

<mark style="color:blue;">`{ "SIMPLE": "simple", "VARIABLE": "simple" }`</mark>

Now lets add a parameter to AWS Parameter Store using:

> aws ssm put-parameter --name /staging/example/server/GOOGLE\_API\_KEY --value google\_api\_key --type "String"

Add the variable to .env:

```
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

You can similarily store your variables in AWS S3, AWS Secrets Manager and Hashicorp Vault. To use them as environment variables, you can simple use:

```
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
