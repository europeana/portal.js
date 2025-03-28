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

## Feature notifications

Features that we may want to highlight to users are declared in
[notifications.js](./notifications.js). Each feature is declared as an object
with a name property, and optional URL property. For a feature notification
to be shown to users, its name needs to be set in the environment variable
`APP_FEATURE_NOTIFICATION`.

To additionally add a tooltip to higlight a specific element of the feature,
add the NewFeatureTooltip to the specific component and pass in the element's id as tooltipTargetId.
When doing so see if any old instances can be cleaned up.

### Example

```js
// src/features/notifications.js
const features = [
  { name: 'immersiveStories', url: '/stories' }
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


```js
// src/components/newFeature.vue
<template>
  <b-button id="new-feature">New feature<b-button>
  <NewFeatureTooltip tooltip-target-id="new-feature" />
</template>
```

```sh
# .env
APP_FEATURE_NOTIFICATION=sideFilters
```
