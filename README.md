# Europeana Collections portal, made with Vue.js + Nuxt.js
 [![Build Status](https://travis-ci.com/europeana/portal.js.svg?branch=master)](https://travis-ci.com/europeana/portal.js) [![Maintainability](https://api.codeclimate.com/v1/badges/0510faf1055ef06c5938/maintainability)](https://codeclimate.com/github/europeana/portal.js/maintainability)

## Prerequisites

1. Node.js version 12, and npm
2. [Contentful](https://www.contentful.com/) CMS account

## Configuration
Configuration options can be set in a .env file (see [.env.example](/.env.example))
or via ENV variables on your machine.

For Europeana API connections you may additionally use a .apisrc.js file in the
root of your project, see the [relevant README](modules/apis/README.md) for more
explanation.

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

Run the full test suite with: `npm test`

### Unit tests
`npm run test:unit` runs all unit tests.

To run unit tests from a single file, append the full path, e.g.
`npm run test:unit tests/unit/components/PageHeader.spec.js`

### End-to-end tests

`npm run test:e2e` runs all end-to-end tests.

To run a single end-to-end test file, append the path **without tests/features**, e.g.
`npm run test:e2e common/header.feature`

## License

Licensed under the EUPL v1.2.

For full details, see [LICENSE.md](LICENSE.md).
