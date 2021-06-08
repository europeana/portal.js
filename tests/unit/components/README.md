# TESTS/UNIT/COMPONENTS

This directory contains unit tests for the app's
[Vue components](../../../src/components/).

Tests are performed using [Vue Test Utils](https://vue-test-utils.vuejs.org/).

## Guidelines

1. Favour [`shallowMount`](https://vue-test-utils.vuejs.org/api/shallowMount.html)
  instead of `mount`.
2. Favour [stubbing](https://vue-test-utils.vuejs.org/api/options.html#stubs)
  Bootstrap Vue components instead of adding them to `localVue`.
