# Europeana Collections portal, made with Vue.js + Nuxt.js
 [![Build Status](https://travis-ci.com/europeana/portal.js.svg?branch=master)](https://travis-ci.com/europeana/portal.js) [![Maintainability](https://api.codeclimate.com/v1/badges/0510faf1055ef06c5938/maintainability)](https://codeclimate.com/github/europeana/portal.js/maintainability)

## Prerequisites

1. Node.js version 12, and npm
2. [Contentful](https://www.contentful.com/) CMS account

## Build Setup

```bash
# install package dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm start

# generate static project
$ npm run generate

# serve storybook with hot reload at localhost:6006
$ npm run storybook

# generate static storybook
$ npm run build-storybook

```

For detailed explanation on how things work, refer to [Nuxt.js docs](https://nuxtjs.org).

## Testing

To run end-to-end tests, you will need Docker Engine and Compose installed and
the docker service running.

Run tests with:

```bash
$ npm test
```
### Running unit tests only
`npm run test:unit` just runs everything.

To run a single file: `npm run test:unit -g tests/unit/[REST_OF_FILE_PATH]`

### Running end-to-end tests only

`npm run test:e2e` and `npm run test:e2e:ci` just run everything.

If you've manually started the test server with: `NODE_ENV=test npm run stack:up`, then you can for example:

Run only the header.feature file using path.

```shell
npm run test:chrome:headless tests/features/header.feature
```


Run only the "header" feature test using its name.

```shell
npm run test:chrome:headless -- -p all --name header
```


Run only the "header" feature in the header file.

```shell
npm run test:chrome:headless tests/features/header.feature -- --name header
```

Run everything with your driver of choice.

```
npm run test:chrome:headless -- -p all
```

`test:chrome:headless` can be substituted for the other avialable driver commands `test:gecko` and `test:chrome`.

Be aware however that with `geckodriver` some tests are known to fail as it is not yet feature complete.
It is therefore at present of limited use.


## License

Licensed under the EUPL v1.2.

For full details, see [LICENSE.md](LICENSE.md).
