# Europeana Collections portal, made with Vue.js + Nuxt.js
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=europeana_portal.js&metric=sqale_rating)](https://sonarcloud.io/dashboard?id=europeana_portal.js)
[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=europeana_portal.js&metric=reliability_rating)](https://sonarcloud.io/dashboard?id=europeana_portal.js)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=europeana_portal.js&metric=security_rating)](https://sonarcloud.io/dashboard?id=europeana_portal.js)

## Prerequisites

1. Node.js version 16, and npm
2. [Contentful](https://www.contentful.com/) CMS account
3. Redis cache (included as Docker Compose service for development)

## Configuration

Configuration options can be set in a .env file (see [.env.example](/.env.example))
or via ENV variables on your machine.

Some core features such as authentication and editorial content require the
relevant configuration options to be specified. In particular, pay attention to
the Europeana APIs, Contentful, Redis and oAuth sections in the example .env file.

## Build

```shell
# start services
docker-compose up

# install package dependencies
npm install

# serve with hot reload at localhost:3000
npm run dev

# build for production and launch server
npm run build
npm start
```

For detailed explanation on how things work, refer to [Nuxt.js docs](https://nuxtjs.org).

## Testing

To run end-to-end tests, you will need Docker Engine and [Compose](https://docs.docker.com/compose/)
installed and the docker service running.

Run the full test suite with: `npm test`

### Unit tests

`npm run test:unit` runs all unit tests.

To run unit tests from a single file, append the full path, e.g.
`npm run test:unit tests/unit/components/PageHeader.spec.js`

### End-to-end tests

First, create an env file for the app container, copying
[tests/e2e/docker/app/.env.example](tests/e2e/docker/app/.env.example) to
tests/e2e/docker/app/.env and populating with actual API keys.

`npm run test:e2e` runs all end-to-end feature tests.

To run a single end-to-end test file, append the full path, e.g.
`npm run test:e2e tests/e2e/features/common/header.feature`

If you have modified app files and want to re-run e2e tests, you will need to first
rebuild the generated Docker images in the test stack, with `npm run test:stack:rebuild`

### Visual tests

Ensure that you have set a [Percy](https://percy.io) token as `PERCY_TOKEN` in
tests/e2e/docker/nightwatch-visual/.env, then run `npm run test:visual`.

## License

Licensed under the EUPL v1.2.

For full details, see [LICENSE.md](LICENSE.md).
