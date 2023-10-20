# `@europeana/vue-session`

Vue plugin to handle activity-based sessions.

A session is defined as user activity on a website across any number of tabs
and browser restarts, so long as there continues to be activity within a given
timeframe, defaulting to 30 minutes. If no activity is detected within that
timeframe, then a new session starts when it resumes. Sessions are not
created for known bots.


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

On initialisation, the session will be loaded from `localStorage` if one is found,
else a new one will be started and stored.

All components will then have access to a getter `$session` which will return
the active session.

```js
export default {
  name: 'MyComponent',

  mounted() {
    console.log('session', this.$session)
    // { id: '1a60dfb1-a7bf-4cd8-a1e6-666fdcf699c8', timestamp: 1697789875911 }
  }
}
```


## Options

Pass options to the plugin when registering it:

```js
Vue.use(VueSession, { storage: { prefix: 'myApp.' } });
```

Available options:
```js
// Default values shown
{
  monitor: {
    // document events to regard as user activity
    events: ['drag', 'keydown', 'mousedown', 'mousemove', 'scroll', 'touchstart', 'wheel']
    // number of seconds to pause monitoring after activity is observed, to
    // prevent constantly updating the session timestamp during periods of
    // sustained activity
    interval: 60
  },
  session: {
    // number of minutes of inactivity after which a session expires
    timeout: 30
  },
  storage: {
    // string to use as prefix for localStorage key "session"
    // e.g. `prefix: 'myApp.'` will result in a key of "myApp.session"
    prefix: ''
  }
}
```


## License

Licensed under the EUPL v1.2.
