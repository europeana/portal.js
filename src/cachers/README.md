# CACHERS

This directory contains scripts that gather data to cache, store it to Redis,
and retrieve it.

## CLI

* `entities`
  * `organisations`
    * `npm run cache entities:organisations get`: Reads harvested organisations
      from the cache, and outputs to the console.
    * `npm run cache entities:organisations set`: Paginates over the Europeana
      Entity API for organization-type entities, reduces these to an object
      keyed by identifier with values containing the prefLabel, and writes to
      the cache.
* `items`
  * `recent`
    * `npm run cache items:recent get`: Reads recent items from the cache, and
      outputs to the console.
    * `npm run cache items:recent set`: Queries the Europeana Record API for
      the four most recently updated datasets containing content tier 4 items,
      selects one item from each at random, but seeded to today's date,
      and writes the items' metadata to the cache.
