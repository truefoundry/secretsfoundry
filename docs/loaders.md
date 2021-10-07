---
description: Inject the value in .env variables which themselves can contain variables
---

# Loaders

A normal `.env` file generally has a structure like

```text
VARIABLE1=Value1
VARIABLE2=Value2
VARIABLE3=Vaule3
```

Secretsfoundry allows one to use compose environment variables using other variables or from the existing environment variables. 

```text
VARIABLE1=value1
VARIABLE2={VARIABLE1}-hello
```

SecretsFoundry currently provides support for the following sources:

1. AWS Parameter Store
2. AWS Secrets Manager
3. Hashicorp Vault
4. AWS S3

We will soon be extending support for GCP Secrets Engine and Azure Key Vault. If you need support for other sources, reach out to us for support or send a PR.

To use a loader, the general syntax is:

```text
VARIABLE=${loader(args):path/to/value}
```

  
**loader:** Can be one of these types: `aws-ssm` , `aws-s3`, `aws-secrets` and `vault` . If any arguments need to be passed, they are passed inside `()`  
**path:** The path from where value is to be fetched.

