---
description: How to use secretsfoundry
---

# Usage

After installing `secretsfoundry` onto your system, you are ready to use it.

## Commands

### Run

Runs secretsfoundry reading the `.env.<stage>` file and injecting them as environment variables into the running process from your command or script.

**Options**

1. **--stage:** Sets the stage for the process and reads `.env.{stage}` file according to this. It depends on [`dotenv`](https://www.npmjs.com/package/dotenv) for loading them. If not given, will look for `.env.development` in the directory where the command is run. Not a required option.
2. **--command**: Runs a single command with the injected environment variables. Not a required option. \***\*Alias: **-c\*\*
3. **--script:** Runs multiple commands with the injected environment variables. These run using the native shell. Not a required option. Alias: **-s Note:** Either `--script` or `--command` is required. The CLI will throw an error if either both or present or both are absent.

{% tabs %}
{% tab title="Single Command" %}

```text
secretsfoundry run --stage <STAGE> -c "<command>"
```

{% endtab %}

{% tab title="Multple Commands" %}

```text
secretsfoundry run --stage <STAGE> -s "<command>"
```

{% endtab %}
{% endtabs %}

Multiple commands mean that you are using identifiers that are present in the shell, like `&&` ,or `;` .

#### Examples

{% tabs %}
{% tab title="Single Command" %}

```text
secretsfoundry run --stage development -C "npm --version"
```

{% endtab %}

{% tab title="Multiple Commands" %}

```text
secretsfoundry run --stage development -s "npm --version && npm install"
```

{% endtab %}
{% endtabs %}

{% tabs %}
{% tab title="Without stage" %}

```text
secretsfoundry run -c "npm --version"
```

The above will look for `.env.development` file in the project root and use that contents for extracting values and injecting them as env variables.
{% endtab %}

{% tab title="With stage" %}

```text
secretsfoundry run --stage prod -c "npm --version"
```

Will look for a file named `.env.prod` in the directory above command is run and uses its content for extracting values and injecting them as env variables.
{% endtab %}
{% endtabs %}
