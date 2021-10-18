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
Retrieves and caches all organization-type, Europeana-scoped entities from the
Entity API.

#### `collections:times`
Retrieves and caches all timespan-type, Europeana-scoped entities from the
Entity API.

#### `collections:topics`
Retrieves and caches all concept-type, Europeana-scoped entities from the
Entity API.

#### `collections:topics:featured`
Retrieves and caches a hard-coded subset of featured, concept-type,
Europeana-scoped entities from the Entity API. See `FEATURED` in
[`./collections/topics/featured.js`](./collections/topics/featured.js) for the
featured topic IDs.

### `items`

#### `items:recent`
Queries the Europeana Record API for the four most recently updated datasets
containing content tier 4 items, selects one item from each at random, but
seeded to today's date, and caches the items' metadata.

#### `items:type-counts`
Queries the Europeana Record API for the total number of items available by EDM
type, of content tiers 1-4.
