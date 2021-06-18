# SERVERLESS

This directory contains standalone scripts intended for deployment to a
serverless computing environment.

## Contents

* `organisations/`
  * `entities/`
    * `fetch`: Fetches harvested organisations from the Redis cache, for use on
      the organisation hub page.
    * `harvest`: Harvests organisations from the Entity API and writes to the
      Redis cache.

## TODO

1. Consider whether these really belong here in the portal.js repo, or elsewhere
