# `@europeana/vue-session`

Vue plugin to handle sessions.

## Installation

Install the package:
```sh
npm install --save @europeana/vue-session
```

## Usage

Register the Vue plugin:
```js
import Vue from 'vue';
import VueSession from '@europeana/vue-session';

Vue.use(VueSession);
```

On initialisation, a session ID will be generated as a UUID and stored in
sessionStorage, unless one already exists. By default the key used is "sessionId".

All components will then have access to a getter `$session` which will return
the session ID from sessionStorage.

```js
export default {
  name: 'MyComponent',

  mounted() {
    console.log('session', this.$session)
  }
}
```


## Options

### prefix

Adds an optional prefix to the sessionStorage key:

```js
Vue.use(VueSession, { prefix: 'myApp.' }); // Full key will be "myApp.sessionId"
```


## License

Licensed under the EUPL v1.2.
