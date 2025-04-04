# Europeana Collections portal, made with Vue.js + Nuxt.js
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=europeana_portal.js&metric=sqale_rating)](https://sonarcloud.io/dashboard?id=europeana_portal.js)
[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=europeana_portal.js&metric=reliability_rating)](https://sonarcloud.io/dashboard?id=europeana_portal.js)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=europeana_portal.js&metric=security_rating)](https://sonarcloud.io/dashboard?id=europeana_portal.js)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=europeana_portal.js&metric=coverage)](https://sonarcloud.io/summary/new_code?id=europeana_portal.js)

## Requirements

1. Node.js version 18, and npm
2. [Contentful](https://www.contentful.com/) CMS account
3. Redis cache
4. PostgreSQL database

NB: Redis & PostgreSQL are included as Docker Compose service for development.

## Configuration

Configuration options can be set in a .env file (see [.env.example](./packages/portal/.env.example))
or via ENV variables on your machine.

Some core features such as authentication and editorial content require the
relevant configuration options to be specified. In particular, pay attention to
the Europeana APIs, Contentful, Redis and oAuth sections in the example .env file.

## Build

```shell
# start services
docker-compose up

# install package dependencies
npm ci

# serve with hot reload at localhost:3000
npm run dev

# build for production and launch server
npm run build
npm start
```

For detailed explanation on how things work, refer to [Nuxt.js docs](https://nuxtjs.org).

### Docker image

To build the Docker image, run:

```shell
docker build -t europeana/portal.js -f packages/portal/Dockerfile .
```

### Docker Compose

To run everything with Docker Compose, including the app:

```shell
docker compose -f docker-compose.app.yml up
```

The app will be exposed on the host on port 8080.

## Testing

To run end-to-end tests, you will need Docker Engine and [Compose](https://docs.docker.com/compose/)
installed and the docker service running.

Run the full test suite with: `npm test`

### Unit tests

`npm run test:unit` runs all unit tests.

To run unit tests from a single file, append the full path, e.g.
`npm run test:unit packages/portal/tests/unit/components/PageHeader.spec.js`

To run unit tests from just one of the packages registered as a Jest project,
run e.g.
`npm run test:unit -- --selectProjects portal`

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

## Versioning

Versioning of the monorepo [packages](./packages/) is managed using
[Lerna](https://lerna.js.org/).

```shell
npx lerna version
```

## License

Licensed under the EUPL v1.2.

For full details, see [LICENSE.md](LICENSE.md).
