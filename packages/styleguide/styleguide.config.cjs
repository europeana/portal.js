const { resolve } = require('path');
const { getWebpackConfig } = require('nuxt');
const bootstrapVersion = require('bootstrap/package.json').version;
const bootstrapVueVersion = require('bootstrap-vue/package.json').version;

/** @type import("vue-styleguidist").Config */
module.exports = async() => {
  // get the webpack config directly from nuxt
  const nuxtWebpackConfig = await getWebpackConfig('client', {
    for: 'dev',
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
      ...nuxtWebpackConfig.resolve,
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
            name: 'Font icons',
            content: '../portal/docs/style/FontIcons.md'
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
          },
          {
            name: 'Account',
            components: '../portal/src/components/account/[A-Z]*.vue'
          },
          {
            name: 'Entity',
            components: '../portal/src/components/entity/[A-Z]*.vue'
          },
          {
            name: 'Generic',
            components: '../portal/src/components/generic/[A-Z]*.vue'
          },
          {
            name: 'Home',
            components: '../portal/src/components/home/[A-Z]*.vue'
          },
          {
            name: 'Item',
            components: '../portal/src/components/item/[A-Z]*.vue'
          },
          {
            name: 'Related',
            components: '../portal/src/components/related/[A-Z]*.vue'
          },
          {
            name: 'Search',
            components: '../portal/src/components/search/[A-Z]*.vue'
          }
        ]
      }
    ],
    assetsDir: '../portal/src/assets',
    skipComponentsWithoutExample: true,
    require: [
      resolve(__dirname, '../portal/src/assets/scss/style.scss'),
      resolve(__dirname, './styleguide/style.scss'),
      resolve(__dirname, '../portal/src/assets/img/illustrations/il-item-not-found.svg')
    ],
    renderRootJsx: resolve(__dirname, './styleguide/styleguide.root.js'),
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
