# secretsfoundry

- Package to manage your environment variables and secrets

## Required

- Node.js 14+

## How to using

- Lunch commands

  - `npm start`
    - run cli
  - `npm run dev`
    - run force debug cli
  - `npm run lint`
    - run lint
  - `npm run build`
    - run tsc
      - this only development, not production
  - `npm run test`
    - Launches the test runner by watch mode
  - `npm run test`
    - get coverage report

## To test locally

npx ts-node -r tsconfig-paths/register src/index.ts run --script "node example.js"

## How to give variables with variable values

```text
VARIABLE=${loader:path}
```

where:  
**loader:** can be one of these types: `vault` , `ssm`, `s3` and `sec`.
**path:** the path from where value is to be fetched.

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

# SSM Loader

SSM loader loads the value from SSM Parameter Store.

### Usage

```text
VARIABLE=${ssm:<region>;;<name>;;<withDecryption=true|false>}
```

### Parameters

**ssm:** Tells that loader is of type ssm.

**region:** Region in which value is to be looked for. Must follow the following REGEX `/^(us(-gov)?|ap|ca|cn|eu|sa)-(central|(north|south)?(east|west)?)-\d?/`

**name:** Name of the secret to be used. Must follow the REGEX `/^[\w\/-._]+$/`

**withDecryption:** Tells whether the secret value should be decrypted or not. Can only be either `true` or `false`

# VaultLoader

```text
VARIABLE=${vault:<secret_name>}
```

### Parameters

**vault**: tells loader is of type vault.

**secret_name**: name of the secret to be used.

**NOTE**: Currently, one needs to export root_id and secret_id as `ROOT_ID` and `SECRET_ID` to make vault loader work.
