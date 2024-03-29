# Migrations

This package contains [Contentful](https://www.contentful.com/) content model
migrations.

## Prerequisites

1. A Contentful account and space
2. [Europeana's UI extensions](https://github.com/europeana/contentful-extensions)
  installed in the Contentful space

## Usage

Login:
```bash
npx contentful login
```

Select space:
```bash
npx contentful space use
```

Run a migration:
```bash
npx contentful space migration packages/contentful/migrations/0001-migration-script.cjs
```

Generate migration for entire content model:
```bash
npx contentful space generate migration -f packages/contentful/migrations/0000-content-model.cjs
```

## Documentation

* [Tutorial](https://www.contentful.com/developers/docs/tutorials/cli/scripting-migrations/)
* [Writing migrations](https://github.com/contentful/contentful-migration)
* [Generating migrations](https://github.com/contentful/contentful-cli/tree/master/docs/space/generate/migration)
* [Running migrations](https://github.com/contentful/contentful-cli/tree/master/docs/space/migration)
