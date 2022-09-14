# Unit tests

This directory contains unit tests for source code in [src](../src).

Unit tests are run using [Jest](https://jestjs.io/), with [Vue Test Utils](https://vue-test-utils.vuejs.org/) providing Vue-specific test helpers, and some custom utility functions for working with Nuxt apps.

## Tips

### Wait for all asynchronous code

If the code you are testing makes multiple async/await calls, and you want to test the end result after all have completed, then before your expectation, run:
```js
await new Promise(process.nextTick);
```
