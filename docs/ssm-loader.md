---
description: About SSM Loader and how to use
---

# AWSSSM Loader

AWSSSMLoader loads the variable from AWS Parameter Store. We get the AWS credentials from the environment variables `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`. It also falls back to looking up the credentials in the local aws config directory if it cannot find the variables set.

### Usage

```text
VARIABLE=${aws-ssm(region=us-east-2,decrypt=true):/path/to/param}
```

### **Syntax Terms Explanation**

**aws-ssm:** Defines that provider is aws-ssm and values will need to be fetched from parameters store

**\(\):** Parameters for aws-ssm. Currently, two parameters are accepted:  
**region:** region for aws-ssm. Defaults to _us-east-1_  
**decrypt:** whether the value should be decrypted or not. Defaults to _false._

**`:`:** Separator telling now the path to param starts

**path:** Name of the secret to be used.

Hence, the complete variable **must follow** the REGEX: `/^aws-ssm(((.*)?))?:([a-zA-Z0-9_.-\/]+)$/`
