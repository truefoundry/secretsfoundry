---
description: About S3 Loader and how to use
---

# S3 Loader

S3 loader loads the value from S3 Bucket.

### Usage

```text
VARIABLE=${s3:<region>;;<name>;;<key>}
```

### **Parameters**

**s3:** Tells that loader is of type s3 and to load data from s3.

**region:** Region in which value is to be looked for. Must follow the following REGEX `/^(us(-gov)?|ap|ca|cn|eu|sa)-(central|(north|south)?(east|west)?)-\d?/`

**name:** Name of the bucket to be used. Must follow the REGEX `/^[\w\/-._]+$/`

**key:** The Key to be used for fetching the object details. Must follow the REGEX `/^[\w]+?/`
