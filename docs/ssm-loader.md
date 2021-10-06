---
description: About SSM Loader and how to use
---

# SSM Loader

SSM loader loads the value from SSM Parameter Store.

### Usage

```text
VARIABLE=${ssm:<region>;;<name>;;<withDecryption=true|false>}
```

### **Parameters**

**ssm:** Tells that loader is of type ssm.

**region:** Region in which value is to be looked for. Must follow the following REGEX `/^(us(-gov)?|ap|ca|cn|eu|sa)-(central|(north|south)?(east|west)?)-\d?/`

**name:** Name of the secret to be used. Must follow the REGEX `/^[\w\/-._]+$/`

**withDecryption:** Tells whether the secret value should be decrypted or not. Can only be either `true` or `false`
