---
description: 'https://aws.amazon.com/s3/'
---

# AWS S3

AwsS3Loader loads the secret from S3 Bucket.

## Usage

```text
VARIABLE=${aws-s3(region='us-east-2'):bucket/key}
```

## **Syntax Terms Explanation**

**aws-s3:** Tells that provider is s3 and to load data from s3.

**\(\):** Parameters for aws-s3. Currently, a single paramater is accepted:  
**region:** region for aws-s3. If this is not set, secretsfoundry looks for `AWS_REGION` environment variable. If both aren't set, you can make AWS look for the default region defined in ~/.aws/config by setting the environment variable `AWS_SDK_LOAD_CONFIG=1`

**bucket:** Name of the bucket to be used. **Must follow** the REGEX `/^[\w/-._]+$/`

**key:** The key used for fetching the object details. **Must follow** the REGEX `/^[\w]+?/`
