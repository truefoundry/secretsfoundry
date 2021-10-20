---
description: Welcome to the documentation for SecretsFoundry. A new way to manage environment variables.
---

# What is SecretsFoundry?
*SecretsFoundry* is a tool aimed to make managing your environment variables easier and more secure, enabling you to manage your secrets and their rotations with minimal config.

## Why SecretsFoundry?

There are several reasons to adopt SecretsFoundry in your workflow.
1. A simple solution that makes secret management easier for developers.
2. Drop in replacement for packages like `dotenv` and `dotenv-expand`.
3. Works with muliple secret managers like
  1. [AWS Secrets Manager](loaders/secrets-loader.md)
  2. [AWS Parameter Store](loaders/ssm-loader.md)
  3. [AWS S3](loaders/s3-loader.md) 
  4. [Hashicorp Vault](loaders/hashicorp-vault-loader.md)
4. All env variables are version controlled using Git and can follow the Gitops methodology.
5. Requires no change to the production or CI/CD environment while adding / removing environment variables. 

## Questions?

We're always happy to help with code or other questions you might have. Search our documentation,or post questions to our [Github repo](https://github.com/innoavator/secretsfoundry) if you run into any technical roadblocks. 
