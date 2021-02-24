// Workarounds for test coverage of Vue files with Istanbul.
// Courtesy of: https://gist.github.com/lsapan/3bfd0ffc0fb3d4a036fce84f6eea142e

const { execSync } = require('child_process');

module.exports = {
  chainWebpack: (config) => {
    if (process.env.NODE_ENV === 'test') {
      execSync('sed -i "s/source: pathutils.relativeTo(start.source, origFile),/source: origFile,/" node_modules/istanbul-lib-source-maps/lib/get-mapping.js');

      config.devtool('cheap-module-eval-source-map');
      config.module.rule('js')
        .test(/\.js$/)
        .use('istanbul-instrumenter-loader')
        .loader('istanbul-instrumenter-loader')
        .before('babel-loader')
        .options({
          esModules: true
        });
    }
  }
};
