# Module: apis

This module is responsible for loading and supplying to the app configuration
for Europeana APIs, including their origin, path and authentication key.

## Configuration

### API keys from environment variables

API keys may be supplied in environment variables:
* `EUROPEANA_ENTITY_API_KEY`: Entity API key
* `EUROPEANA_NEWSPAPER_API_KEY`: Newspaper API key
* `EUROPEANA_RECORD_API_KEY`: Record API key, and Newspaper API key if
  `EUROPEANA_NEWSPAPER_API_KEY` is not set

### Runtime Configuration (RC) file

Additional settings may be specified in an "apis" RC file. Any format supported
by [consmiconfig](https://www.npmjs.com/package/cosmiconfig) may be used.

An example in JS format is supplied in [.apisrc.js.example](./.apisrc.js.example).
Copy this to .apisrc.js in your project root and customise the contents.

Alternatively, this configuration can be formatted as a JSON string and stored
in the environment variable `EUROPEANA_APIS` which may be necessary in
environments where configuration files are not suitable, e.g. in Docker
containers.

Each section provides environment-specific configuration for each of the
available APIs. Only those settings that need to be overriden need be supplied
as all others will inherit from the defaults.

#### Example RC section
```js
module.exports = {
  defaults: {
    record: {
      origin: 'https://record-api.example.org',
      path: '/api/v2',
      key: 'record-api-key'
    },
    entity: {
      origin: 'https://entity-api.example.org',
      key: 'entity-api-key'
    },
    newspaper: {
      key: 'newspaper-api-key'
    }
  }
};
```

This section will cause the app to:
* Set a custom origin, path and key for the Record API
* Set a custom origin and key for the Entity API, but use the default path
  from module [defaults.js](./defaults.js)
* Set a custom key for the Newspaper API, but use the default origin and path
  from module [defaults.js](./defaults.js)

Two types of section are available:
1. *Defaults:* used in all scenarios where an origin-specific section is not
  found. This is the section named `defaults`.
2. *Origin-specific:* used only when the origin of the request to the app
  matches this section's origin. Such sections are named after the origin, e.g.
  `http://app.example.org`.

## Load order

1. Module defaults for API origins and paths are read from
  [defaults.js](./defaults.js)
2. API keys are read from environment variables and included in these module
  defaults
3. At build time, runtime configuration is read from `EUROPEANA_APIS` if set,
  else from an RC file if present
4. Configuration in the RC's defaults section is merged into the module defaults
5. Each origin-specific section in the runtime configuration is amended to
  inherit the defaults for any options not overriden

### Example RC
```js
module.exports = {
  defaults: {
    record: {
      origin: 'https://record-api.example.org',
      path: '/api/v2',
      key: 'record-api-key'
    },
    entity: {
      origin: 'https://entity-api.example.org',
      key: 'entity-api-key'
    },
    newspaper: {
      key: 'newspaper-api-key'
    }
  },
  'http://app.example.org': {
    record: {
      origin: 'https://other-record-api.example.org'
    },
    entity: {
      key: 'other-entity-api-key'
    }
  }
};
```

This RC will result in:
* for requests via the origin http://app.example.org:
  * Record API requests go to https://other-record-api.example.org/api/v2 with
    API key "record-api-key"
  * Entity API requests go to https://entity-api.example.org/entity with API
    key "other-entity-api-key"
  * Newspapers API requests go to https://newspapers.eanadev.org/api/v2 with
    API key "newspaper-api-key"
* for requests via other origins:
  * Record API requests go to https://record-api.example.org/api/v2 with
    API key "record-api-key"
  * Entity API requests go to https://entity-api.example.org/entity with API
    key "entity-api-key"
  * Newspapers API requests go to https://newspapers.eanadev.org/api/v2 with
    API key "newspaper-api-key"
