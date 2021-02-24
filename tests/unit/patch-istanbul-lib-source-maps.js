// Patch for test coverage of Vue files with Istanbul.
//
// Presumed by the test env config in vue.config.js
//
// Courtesy of: https://gist.github.com/lsapan/3bfd0ffc0fb3d4a036fce84f6eea142e
// See: https://github.com/istanbuljs/istanbuljs/issues/464

const { execSync } = require('child_process');

execSync('sed -i "s/source: pathutils.relativeTo(start.source, origFile),/source: origFile,/" node_modules/istanbul-lib-source-maps/lib/get-mapping.js');
