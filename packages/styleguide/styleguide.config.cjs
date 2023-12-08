const { resolve } = require('path');
const { getWebpackConfig } = require('nuxt');
const bootstrapVersion = require('bootstrap/package.json').version;
const bootstrapVueVersion = require('bootstrap-vue/package.json').version;

/** @type import("vue-styleguidist").Config */
module.exports = async() => {
  // get the webpack config directly from nuxt
  const nuxtWebpackConfig = await getWebpackConfig('client', {
    for: process.env.NODE_ENV === 'production' ? 'build' : 'dev',
    rootDir: '../portal'
  });

  const webpackConfig = {
    module: {
      rules: [
        ...nuxtWebpackConfig.module.rules.filter(
          // remove the eslint-loader
          a => a.loader !== 'eslint-loader'
        )
      ]
    },
    resolve: {
      ...nuxtWebpackConfig.resolve
    },
    plugins: [
      ...nuxtWebpackConfig.plugins
    ]
  };

  return {
    title: 'Europeana Style Guide',
    sections: [
      {
        name: 'Style',
        sections: [
          {
            name: 'Typography',
            content: '../portal/docs/style/Typography.md'
          },
          {
            name: 'Font icons',
            content: '../portal/docs/style/FontIcons.md'
          },
          {
            name: 'Colours and shades',
            content: '../portal/docs/style/ColoursAndShades.vue'
          },
          {
            name: 'Bootstrap Vue',
            sections: [
              {
                name: 'Badge',
                content: '../portal/docs/style/BootstrapVueBadge.md'
              },
              {
                name: 'Button',
                content: '../portal/docs/style/BootstrapVueButton.md'
              }
            ]
          }
        ]
      },
      {
        name: 'Components',
        sections: [
          {
            name: 'Page',
            components: '../portal/src/components/[A-Z]*.vue'
          }
        ].concat([
          'Account',
          'Download',
          'Entity',
          'Error',
          'Generic',
          'Home',
          'Item',
          'Landing',
          'Page',
          'Related',
          'Search',
          'Set',
          'Theme'
        ].map((name) => ({
          name,
          components: `../portal/src/components/${name.toLowerCase()}/[A-Z]*.vue`
        })))
      }
    ],
    assetsDir: '../style',
    skipComponentsWithoutExample: true,
    require: [
      resolve(__dirname, '../style/scss/style.scss'),
      resolve(__dirname, './style.scss')
    ],
    renderRootJsx: resolve(__dirname, './styleguide.root.js'),
    template: {
      head: {
        links: [
          { rel: 'stylesheet', href: `https://unpkg.com/bootstrap@${bootstrapVersion}/dist/css/bootstrap.min.css` },
          { rel: 'stylesheet', href: `https://unpkg.com/bootstrap-vue@${bootstrapVueVersion}/dist/bootstrap-vue.min.css` }
        ]
      },
      favicon: 'https://www.europeana.eu/favicon.ico'
    },
    webpackConfig,
    usageMode: 'expand',
    styleguideDir: 'dist',
    pagePerSection: true
  };
};
