# Migrations

This directory contains [Contentful](https://www.contentful.com/) content model
migrations.

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
npx contentful space migration migrations/0001-migration-script.js
```

Generate migration for entire content model:
```bash
npx contentful space generate migration -f migrations/0000-content-model.js
```

## Documentation

* [Tutorial](https://www.contentful.com/developers/docs/tutorials/cli/scripting-migrations/)
* [Writing migrations](https://github.com/contentful/contentful-migration)
* [Generating migrations](https://github.com/contentful/contentful-cli/tree/master/docs/space/generate/migration)
* [Running migrations](https://github.com/contentful/contentful-cli/tree/master/docs/space/migration)
