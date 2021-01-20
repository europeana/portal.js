# Europeana Collections portal, made with Vue.js + Nuxt.js
[![Maintainability](https://api.codeclimate.com/v1/badges/0510faf1055ef06c5938/maintainability)](https://codeclimate.com/github/europeana/portal.js/maintainability)

## Prerequisites

1. Node.js version 12, and npm
2. [Contentful](https://www.contentful.com/) CMS account

## Configuration
Configuration options can be set in a .env file (see [.env.example](/.env.example))
or via ENV variables on your machine.

Some core features such as authentication and editorial content require the relevant configuration options to be specified.
In particular, pay attention to the Europeana APIs, Contentful and oAuth sections in the example .env file.

## Build
```shell
# install package dependencies
npm install

# serve with hot reload at localhost:3000
npm run dev

# build for production and launch server
npm run build
npm start

# generate static project
npm run generate

# serve storybook with hot reload at localhost:6006
npm run storybook

# generate static storybook
npm run build-storybook

```

For detailed explanation on how things work, refer to [Nuxt.js docs](https://nuxtjs.org).

## Testing

To run end-to-end tests, you will need Docker Engine and [Compose](https://docs.docker.com/compose/) installed and
the docker service running.

Before first running the test suite, setup with: `npm run test:setup`

Run the full test suite with: `npm test`

### Unit tests

`npm run test:unit` runs all unit tests.

To run unit tests from a single file, append the full path, e.g.
`npm run test:unit tests/unit/components/PageHeader.spec.js`

### End-to-end tests

First, create an env file for the app container, copying
[docker/stack/app/.env.example](docker/stack/app/.env.example) to
docker/stack/app/.env and populating with actual API keys.

`npm run test:e2e` runs all end-to-end tests.

To run a single end-to-end test file, append the path **without tests/features**, e.g.
`npm run test:e2e common/header.feature`

If you have modified app files and want to re-run e2e tests, you will need to first
rebuild the generated Docker images in the test stack, with `npm run test:stack:rebuild`

## License

Licensed under the EUPL v1.2.

For full details, see [LICENSE.md](LICENSE.md).
