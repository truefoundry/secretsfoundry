---
description: SecretsFoundry is a tooling to enable efficient secret sharing amoung your various environments.
---

# Installation

SecretsFoundry is currently available as an [NPM package](https://www.npmjs.com/package/secretsfoundry). SecretsFoundry can be used as either a local dependency in your node projects, or as a global dependency for any kind of project.

## Local
To add secretsfoundry to your node(^12.x.x) project, use

{% tabs %}
{% tab title="npm" %}
```bash
npm install secretsfoundry --save-dev
```
{% endtab %}

{% tab title="yarn" %}
```bash
yarn add secretsfoundry -D
```
{% endtab %}
{% endtabs %}



The pakcage can then be evoked using `secretsfoundry` under the package scripts.

## Global
To use secertsfoundry as a global package, run the following command
{% tabs %}
{% tab title="npm" %}
```bash
npm install secretsfoundry -g
```
{% endtab %}

{% tab title="yarn" %}
```text
yarn global add secretsfoundry
```
{% endtab %}
{% endtabs %}

### Confirm Installation

{% tabs %}
{% tab title="Global install" %}
```bash
secretsfoundry --version
```
{% endtab %}

{% tab title="local dependency - yarn" %}
```bash
yarn secretsfoundry --version
```
{% endtab %}
{% endtabs %}


