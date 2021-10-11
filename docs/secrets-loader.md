---
description: Loading secrets from AWS Secrets Manager
---

# AWS Secrets Manager

AwsSecretsLoader loads the secret from AWSSecretsManager.

## Usage in .env

```text
VARIABLE=${aws-secrets(region=us-east-2,raw=true):/path/to/secret}
```

## **Syntax Terms Explanation**

**aws-secrets:** Tells that provider is secrets and to load data from secrets manager.

**\(\):** Parameters for aws-secrets. Currently, two parameters are accepted:  
**region:** region for aws-s3. If this is not set, servicefoundry looks for `AWS_REGION` environment variable. If both aren't set, you can make AWS look for the default region defined in ~/.aws/config by setting the environment variable `AWS_SDK_LOAD_CONFIG=1`
**raw:** Tells whether the secret value should be decrypted or not. Can only be either `true` or `false` . Defaults to _`false`_ .

**path:** Name of the secret used.
