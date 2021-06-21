# CACHERS

This directory contains scripts that gather data to cache, store it to Redis,
and retrieve it.

## Contents

* `entities/`
  * `organisations/`
    * `get`: Fetches harvested organisations from the cache, for use on
      the organisation hub page.
    * `set`: Harvests organisations from the Entity API and writes to the
      cache.
