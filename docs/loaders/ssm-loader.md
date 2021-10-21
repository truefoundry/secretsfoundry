---
description: About SSM Loader and how to use
---

# AWS Parameter Store

Secretsfoundry can load variables from AWS Parameter Store. We get the AWS credentials from the environment variables `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`. It also falls back to looking up the credentials in the local aws config directory if it cannot find the variables set.

## Usage

```
VARIABLE=${aws-ssm(region=us-east-2,decrypt=true):/path/to/param}
```

## **Syntax**

SecretsFoundry recognizes loaders by the prefix of the key.&#x20;

**aws-ssm:** Defines that provider is aws-ssm and values will need to be fetched from AWS Parameters Store.

Args:\
**region:** region for aws-ssm. If this is not set, secretsfoundry looks for `AWS_REGION` environment variable. If both aren't set, you can make AWS look for the default region defined in \~/.aws/config by setting the environment variable `AWS_SDK_LOAD_CONFIG=1` **decrypt:** whether the value should be decrypted or not. Defaults to _false._

**path:** Name of the secret to be used.
