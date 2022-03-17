const { resolve } = require('path');
const { getWebpackConfig } = require('nuxt');
const bootstrapVersion = require('bootstrap/package.json').version;
const bootstrapVueVersion = require('bootstrap-vue/package.json').version;

/** @type import("vue-styleguidist").Config */
module.exports = async() => {
  // get the webpack config directly from nuxt
  const nuxtWebpackConfig = await getWebpackConfig('client', {
    for: 'dev'
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
    resolve: { ...nuxtWebpackConfig.resolve },
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
            content: './docs/style/FontIcons.md'
          },
          {
            name: 'Bootstrap Vue',
            sections: [
              {
                name: 'Badge',
                content: './docs/style/BootstrapVueBadge.md'
              },
              {
                name: 'Button',
                content: './docs/style/BootstrapVueButton.md'
              }
            ]
          }
        ]
      },
      {
        name: 'Components',
        sections: [
          {
            name: 'Entity',
            components: './src/components/entity/[A-Z]*.vue'
          },
          {
            name: 'Generic',
            components: './src/components/generic/[A-Z]*.vue'
          },
          {
            name: 'Item',
            components: './src/components/item/[A-Z]*.vue'
          },
          {
            name: 'Search',
            components: './src/components/search/[A-Z]*.vue'
          }
        ]
      }
    ],
    assetsDir: './src/assets',
    skipComponentsWithoutExample: true,
    require: [
      resolve(__dirname, './src/assets/scss/style.scss'),
      resolve(__dirname, './styleguide/style.scss')
    ],
    renderRootJsx: resolve(__dirname, './styleguide/styleguide.root.js'),
    template: {
      head: {
        links: [
          { rel: 'stylesheet', href: `https://unpkg.com/bootstrap@${bootstrapVersion}/dist/css/bootstrap.min.css` },
          { rel: 'stylesheet', href: `https://unpkg.com/bootstrap-vue@${bootstrapVueVersion}/dist/bootstrap-vue.min.css` }
        ]
      }
    },
    webpackConfig,
    usageMode: 'expand',
    styleguideDir: 'dist',
    pagePerSection: true
  };
};
