---
description: How to use secretsfoundry
---

# Usage

After installing `secretsfoundry` onto your system, you are ready to use it.

## Commands

### Run

Runs secretsfoundry reading the `.env` file and injecting them as environment variables into the running process from your command or script.

**Options**

1. **--stage:** Sets the stage for the process and reads `.env` file according to this. It depends on [`dotenv-flow`](https://www.npmjs.com/package/dotenv-flow) for loading of different types of `.env` files. **Note:** This option is required.
2. **--script**: Runs a single command with the injected environment variables. Not a required option. \***\*Alias: **-S\*\*
3. **--command:** Runs multiple commands with the injected environment variables. These run using the native shell. Not a required option. Alias: **-C Note:** Either `--script` or `--command` is required. The CLI will throw an error if either both or present or both are absent.

{% tabs %}
{% tab title="Single Command" %}

```text
secretsfoundry run --stage <STAGE> -S "<command>"
```

{% endtab %}

{% tab title="Multple Commands" %}

```text
secretsfoundry run --stage <STAGE> -C "<command>"
```

{% endtab %}
{% endtabs %}

Multiple commands mean that you are using identifiers that are present in the shell, like `&&` ,or `;` .

#### Examples

{% tabs %}
{% tab title="Single Command" %}

```text
secretsfoundry run --stage development -S "npm --version"
```

{% endtab %}

{% tab title="Multiple Commands" %}

```text
secretsfoundry run --stage development -C "npm --version && npm install"
```

{% endtab %}
{% endtabs %}
