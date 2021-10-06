---
description: About and how to use
---

# Secrets Loader

Secrets Loader fetches the value from the AWS Secrets Manager.

### Usage

```text
VARIABLE=${sec:<region>;;<name>}
```

### **Parameters**

**sec:** Tells that loader is of type secrets and to load data from secrets manager.

**region:** Region in which value is to be looked for. Must follow the following REGEX `/^(us(-gov)?|ap|ca|cn|eu|sa)-(central|(north|south)?(east|west)?)-\d?/`

**name:** Name of the secret to be used. Must follow the REGEX `/^[\w-]+$/`
