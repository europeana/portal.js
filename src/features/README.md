# FEATURES

This directory is used to declare optional features that may be toggled on by
environment, and new features that may be highlighted to users by a notification.

## Feature toggles

Optional features are declared in [toggles.js](./toggles.js). Each feature
is declared as an object with a name property. Whether that feature
is enabled will be determined by the presence of a corresponding environment
variable set to the value "1".

### Example
```js
// src/features/toggles.js
export default [
  { name: 'turboSpeed' }
];
```

```sh
# .env
ENABLE_TURBO_SPEED=1
```

## New features

New features are declared in [new.js](./new.js). Each feature is declared as
an object with a name property, and optional URL property. For a new feature to
be highlighted to users, its name needs to be set in the environment variable
`APP_NEW_FEATURE`.

### Example

```js
// src/features/new.js
export default [
  { name: 'sideFilters', url: '/blog/side-filters' }
];
```

```js
// src/lang/en.js
export default {
  newFeatureNotification: {
    text: {
      sideFilters: 'Good news, everyone! Filtering your search results has moved to the side!'
    }
  }
};
```

```sh
# .env
APP_NEW_FEATURE=sideFilters
```
