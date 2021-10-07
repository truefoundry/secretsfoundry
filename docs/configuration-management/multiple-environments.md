---
description: Manager your configs across multiple environments using Gitops
---

# Multiple Environments

Using SecretsFoundry, you can create multiple configuration files and commit them to Git 

#### .`env.development`

```text
DB_HOST=localhost
DB_USERNAME = 'admin'
DB_PASSWORD = 'password'

PORT='8080'
```

#### `.env.staging`

```text
DB_HOST=https://staging.example.com
DB_USERNAME = ${aws-ssm:/staging/example/DB_USERNAME}
DB_PASSWORD = ${aws-ssm:/staging/example/DB_PASSWORD}

PORT='8081'
```

#### `.env.prod`

```text
DB_HOST=https://staging.example.com
DB_USERNAME = ${aws-secrets:/prod/example/DB_USERNAME}
DB_PASSWORD = ${aws-secrets:/prod/example/DB_PASSWORD}

PORT='8080'
```

To run your binary in different environments, we can just do:

`secretsfoundry run --stage <development|staging|prod> -c "run binary"`

