# Incubator for Europeana Portal in vue.js + nuxt.js
 [![Build Status](https://travis-ci.com/europeana/incubator-portal-vue-nuxt.svg?branch=master)](https://travis-ci.com/europeana/incubator-portal-vue-nuxt) [![Maintainability](https://api.codeclimate.com/v1/badges/6d547010dcc180c40cf5/maintainability)](https://codeclimate.com/github/europeana/incubator-portal-vue-nuxt/maintainability) [![Test Coverage](https://api.codeclimate.com/v1/badges/6d547010dcc180c40cf5/test_coverage)](https://codeclimate.com/github/europeana/incubator-portal-vue-nuxt/test_coverage)
## Build Setup

``` bash
# install dependencies
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

For detailed explanation on how things work, checkout [Nuxt.js docs](https://nuxtjs.org).

## Testing

Run tests with:

```bash
$ npm test
```
### Running unit tests only
`npm run test:unit` just runs everything.

To run a single file: `npm run test:unit -g tests/unit/[REST_OF_FILE_PATH]`

### Running end to end tests only

`npm run test:e2e` and `npm run test:e2e:ci` just run everything.


If you've manually started the test server with: `npm run build:test && npm run start:test`, then you can for example:

Run only the header.feature file using path.

```npm run test:chrome:headless tests/features/header.feature```


Run only the "header" feature using it's name.

```npm run test:chrome:headless -- -p all --name header```


Run only the "header" feature in the header file.

```npm run test:chrome:headless tests/features/header.feature -- --name header```


Run everything with your driver of choice.

```npm run test:chrome:headless -- -p all```


`test:chrome:headless` can be substituited for the other avialable driver commands `test:gecko` and `test:chrome`.



## License

Licensed under the EUPL V.1.2.

For full details, see [LICENSE.md](LICENSE.md).
