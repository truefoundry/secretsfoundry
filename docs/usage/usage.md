---
description: How to use secretsfoundry
---

# Run SecretsFoundry

After installing `secretsfoundry` onto your system, you are ready to use it.

## Commands

### &#x20;> secretsfoundry run&#x20;

Runs secretsfoundry reading the `.env.<stage>` file and injecting them as environment variables into the running process from your command or script.

**Options**

`--stage: Sets the stage for the process and reads .env.{stage} file according to this. If not given, will look for .env file. Not a required option.`

**`-c / --command`**`: Runs a single command with the injected environment variables. Not a required option.`

**`-s / --script`**`: Runs multiple commands with the injected environment variables. These run using the native shell. Not a required option. `

**`-p / --path`**`: Path to the folder to look for the .env files. Defaults to current working directory. Not a required option. `

If both, `command` and `script` options are empty, `secretsfoundry run` will output the resolved `.env` file onto the terminal. This can be used as a way to debug, should the need be.

{% tabs %}
{% tab title="Single Command" %}
```
secretsfoundry run --stage <STAGE> -c "<command>"
```
{% endtab %}

{% tab title="Multple Commands" %}
```
secretsfoundry run --stage <STAGE> -s "<command>"
```
{% endtab %}
{% endtabs %}

Multiple commands mean that you are using identifiers that are present in the shell, like `&&` ,or `;` .

#### Examples

{% tabs %}
{% tab title="Single Command" %}
```
secretsfoundry run --stage development -c "npm --version"
```
{% endtab %}

{% tab title="Multiple Commands" %}
```
secretsfoundry run --stage development -s "npm --version && npm install"
```
{% endtab %}
{% endtabs %}

{% tabs %}
{% tab title="Without stage" %}
```
secretsfoundry run -c "npm --version"
```

The above will look for `.env` file in the current working directory and use that contents for extracting values and injecting them as env variables.
{% endtab %}

{% tab title="With stage" %}
```
secretsfoundry run --stage prod -c "npm --version"
```

Will look for a file named `.env.prod` in the directory above command is run and uses its content for extracting values and injecting them as env variables.
{% endtab %}
{% endtabs %}

{% tabs %}
{% tab title="Without path" %}
```
secretsfoundry run -c "npm --version"
```

The above will look for `.env` file in the current working directory and use that contents for extracting values and injecting them as env variables.
{% endtab %}

{% tab title="With path" %}
```
secretsfoundry run --stage prod -c "npm --version" -p ./config
```

Will look for a file named `.env.prod` in the `./config` directory, and uses its content for extracting values and injecting them as env variables.
{% endtab %}
{% endtabs %}
