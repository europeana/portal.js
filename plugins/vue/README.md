# PLUGINS/VUE

This directory contains [Vue plugins](https://vuejs.org/v2/guide/plugins.html)
for @europeana/portal.

The enabled plugins are registered by [index.js](./index.js).

## Available plugins

* [facets.js](./facets.js): adds the instance method `$tFacetName` to localise
  the labels of Record API facets, with collection-specific context awareness read
  from the [search store](../../store/search.js).
* [i18n.js](./i18n.js): adds the instance methods `$tNull` and `$tcNull` as
  alternatives to [Vue I18n's](https://kazupon.github.io/vue-i18n/) `$t` and
  `$tc`, to try and translate, else return `null`.
