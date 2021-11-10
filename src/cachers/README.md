# CACHERS

This directory contains scripts that gather data to cache, store it to Redis,
and retrieve it.

## Usage

An NPM script is included to run the cache population scripts, and to view
the prepopulated cache content.

### Populate a cache

To populate one cache by running its cacher:
`npm run cache set [CACHER:NAME]`

Alternatively, to run all known cachers:
`npm run cache set`

### Output a cache

To output one cache entry:
`npm run cache get [LOCALE:]CACHER:NAME`

NB: the `[LOCALE:]` is required if the cacher is localised (see below).

## Available cachers

### `collections`

#### `collections:organisations`
Retrieves and caches all organization-type, Europeana-scoped entities from the
Entity API.

Localised.

#### `collections:times`
Retrieves and caches all timespan-type, Europeana-scoped entities from the
Entity API.

Localised.

#### `collections:times:featured`
Retrieves and caches a daily rotation of 4 times from a hard-coded subset of
timespan-type, Europeana-scoped entities from the Entity API.

Localised.

#### `collections:topics`
Retrieves and caches all concept-type, Europeana-scoped entities from the
Entity API.

Localised.

#### `collections:topics:featured`
Retrieves and caches a daily rotation of 4 topics from a hard-coded subset of
featured, concept-type, Europeana-scoped entities from the Entity API. See
`FEATURED` in [`./collections/topics/featured.js`](./collections/topics/featured.js)
for the featured topic IDs.

Localised.

### `items`

#### `items:recent`
Queries the Europeana Record API for the four most recently updated datasets
containing content tier 4 items, selects one item from each at random, but
seeded to today's date, and caches the items' metadata.

#### `items:type-counts`
Queries the Europeana Record API for the total number of items available by EDM
type, of content tiers 1-4.
