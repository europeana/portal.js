# CACHERS

This directory contains scripts that gather data to cache, store it to Redis,
and retrieve it.

## CLI

* `entities`
  * `organisations`
    * `npm run cache entities:organisations:get`: Reads harvested organisations
      from the cache, and outputs to the console.
    * `npm run cache entities:organisations:set`: Paginates over the Europeana
      Entity API for organization-type entities, reduces these to an object
      keyed by identifier with values containing the prefLabel, and writes to
      the cache.
