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
**region:** region for aws-s3. Defaults to _us-east-1_

**bucket:** Name of the bucket to be used. **Must follow** the REGEX `/^[\w/-._]+$/`

**key:** The key used for fetching the object details. **Must follow** the REGEX `/^[\w]+?/`
