# SERVERLESS

This directory contains standalone scripts intended for deployment to a
serverless computing environment.

## Contents

* `entities/`
  * `organisations/`
    * `fetch`: Fetches harvested organisations from the Redis cache, for use on
      the organisation hub page.
    * `harvest`: Harvests organisations from the Entity API and writes to the
      Redis cache.

## TODO

1. Consider renaming to something other than "serverless" as the scripts can be
   run elsewhere too, e.g. from CLI, on Jenkins, etc. Alternatives: "harvesters"
   / "services" / "mutations" / "data"
