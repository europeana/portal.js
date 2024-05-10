# TODO

## Subpath exports

[package.json](package.json) should declare its subpath exports like:
```json
{
  "exports": {
    ".": "./src/index.js",
    "./codes.js": "./src/codes.js",
    "./langMap.js": "./src/langMap.js",
    "./locales.js": "./src/locales.js"
  }
}
```

It does not at present due to Nuxt/Vue building failing when modules are then
imported like:
```javascript
import { isLangMap } from '@europeana/i18n/langMap.js';
```

In the meantime, no exports are declared and imports are made like:
```javascript
import { isLangMap } from '@europeana/i18n/src/langMap.js';
```

Once this limitation is overcome, switch to subpath exports instead.
