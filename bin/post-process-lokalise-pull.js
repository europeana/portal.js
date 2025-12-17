import fs from 'fs';
import stringify from 'json-stable-stringify-without-jsonify';

import { codes } from '@europeana/i18n';

const run = async() => {
  for (const code of codes) {
    const filePath = new URL(`../packages/portal/src/i18n/lang/${code}.js`, import.meta.url);

    const { default: lang } = await import(filePath);

    // the localeCompare fixes Lokalise's a-z sorting which puts Z before a
    const stringified = stringify(lang, { cmp: (a, b) => a.key.localeCompare(b.key), space: '  ' });

    const js = `export default ${stringified};\n`

    fs.writeFileSync(filePath, js);
  }
};

await run();
