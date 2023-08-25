# `@europeana/vue-session-id`

Vue plugin to generate a session ID using [`uuid`](https://www.npmjs.com/package/uuid)
and store it in sessionStorage.

## Installation

Install the package:
```sh
npm install --save @europeana/vue-session-d
```

## Usage

Register the Vue plugin:
```js
import Vue from 'vue';
import VueSessionId from '@europeana/vue-session-id';

Vue.use(VueSessionId);
```

On initialisation, a session ID will be generated as a UUID and stored in
sessionStorage, unless one already exists. By default the key used is "sessionId".

All components will then have access to a getter `$sessionId` which will return
the session ID from sessionStorage.

```js
export default {
  name: 'MyComponent',

  mounted() {
    console.log('session ID', this.$sessionId)
  }
}
```


## Options

### prefix

Adds an optional prefix to the sessionStorage key:

```js
Vue.use(VueSessionId, { prefix: 'myApp.' }); // Full key will be "myApp.sessionId"
```


## License

Licensed under the EUPL v1.2.
