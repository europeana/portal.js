import fs from 'fs';
import versions from '../pkg-versions.js';

const versionsFile = new URL('../pkg-versions.js', import.meta.url);

let versionsSrc = fs.readFileSync(versionsFile, { encoding: 'utf8' });

for (const pkg in versions) {
  let pkgJsonFile;
  if (pkg === '@europeana/portal') {
    pkgJsonFile = new URL('../package.json', import.meta.url);
  } else {
    pkgJsonFile = new URL(`../node_modules/${pkg}/package.json`, import.meta.url);
  }
  const version = JSON.parse(fs.readFileSync(pkgJsonFile, { encoding: 'utf8' })).version;

  versionsSrc = versionsSrc.replace(new RegExp(`'${pkg}': '[^']+'`), `'${pkg}': '${version}'`);
}

fs.writeFileSync(versionsFile, versionsSrc);
