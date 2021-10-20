---
description: Inject variables into your container
---

# Integrating with Docker

Here is an example Dockerfile

```docker
FROM node:latest

COPY ./app ./app

RUN npm install -g secretsfoundry

WORKDIR app

ENTRYPOINT ["secretsfoundry", "run", "-s", "node example.js"]
```

* The base image in this example, already has node installed. This is required as `secretsfoundry` is an npm package. In case, your base image is different, make sure to have `node` and `npm` installed in the image before proceeding to install `secretsfoundry`
* Once we get the image ready, we are ready to install `secretsfoundry` on our container. To install `secretsfoundry`, run `npm install -g secretsfoundry`
* Once that's done, we are ready to use `secretsfoundry`. In the example above, we are calling a sample `.js` file which is loaded onto the container.

Once built and run, the container will run `node example.js` with the injected `.env` file values
