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

Secretsfoundry allows one to use variables also in place of the above values. The variables are defined between `${ }` .

```text
VARIABLE=${i_have_a_variable_value}
```

However, just writing text between `${ }` won't work. There is a special syntax, which needs to be followed.

```text
VARIABLE=${loader:path}
```

where:  
**loader:** can be one of these types: `aws` , `ssm`, `s3` and `sec` .  
**path:** the path from where value is to be fetched.
