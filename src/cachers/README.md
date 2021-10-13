# CACHERS

This directory contains scripts that gather data to cache, store it to Redis,
and retrieve it.

## Usage

An NPM script is included to run the cache population scripts, and to view
the prepopulated cache content.

### Populate a cache

`npm run cache [CACHER:NAME] set`

### Output a cache

`npm run cache [CACHER:NAME] get`


## Available cachers

### `collections`

#### `collections:organisations`
Paginates over the Europeana Entity API for organization-type entities, reduces
these to an object keyed by identifier with values containing the `prefLabel`,
and caches them.

#### `collections:times`
**TODO**

#### `collections:topics`
**TODO**

### `items`

#### `items:recent`
Queries the Europeana Record API for the four most recently updated datasets
containing content tier 4 items, selects one item from each at random, but
seeded to today's date, and caches the items' metadata.

#### `items:type-counts`
**TODO**
