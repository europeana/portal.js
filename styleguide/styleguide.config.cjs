const { resolve } = require('path');
const { getWebpackConfig } = require('nuxt');
const bootstrapVersion = require('bootstrap/package.json').version;
const bootstrapVueVersion = require('bootstrap-vue/package.json').version;

const FILTERED_PLUGINS = [
  'WebpackBarPlugin',
  'HtmlWebpackPlugin',
  'VueSSRClientPlugin',
  'HotModuleReplacementPlugin',
  'FriendlyErrorsWebpackPlugin'
];

/** @type import("vue-styleguidist").Config */
module.exports = async() => {
  // get the webpack config directly from nuxt
  const nuxtWebpackConfig = await getWebpackConfig('client', {
    for: process.env.NODE_ENV === 'production' ? 'build' : 'dev',
    rootDir: '../packages/portal'
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
      alias: {
        ...nuxtWebpackConfig.resolve.alias,
        // Prevent multiple instances of Vue
	      // See: https://github.com/bootstrap-vue/bootstrap-vue/issues/3351
	      vue$: resolve(__dirname, 'node_modules/vue/dist/vue.esm.js')
      }
    },
    plugins: [
      ...nuxtWebpackConfig.plugins.filter(
        // remove plugins that conflict with vue-styleguidist's
        (p) => FILTERED_PLUGINS.indexOf(p.constructor.name) === -1
      )
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
            content: '../packages/portal/docs/style/Typography.md'
          },
          {
            name: 'Font icons',
            content: '../packages/portal/docs/style/FontIcons.md'
          },
          {
            name: 'Colours',
            content: '../packages/portal/docs/style/Colours.md'
          },
          {
            name: 'Borders and shadows',
            content: '../packages/portal/docs/style/BordersAndShadows.md'
          },
          {
            name: 'Bootstrap Vue',
            sections: [
              'Alert',
              'Badge',
              'Breadcrumb',
              'Button',
              'Card',
              'Dropdown',
              'Form',
              'Link',
              'ListGroup',
              'Modal',
              'Nav',
              'Navbar',
              'Sidebar',
              'Table',
              'Tabs',
              'Toast',
              'Tooltip'
            ].map((name) => ({
              name,
              content: `../packages/portal/docs/style/BootstrapVue/${name}.md`
            }))
          }
        ]
      },
      {
        name: 'Components',
        sections: [
          {
            name: 'Page',
            components: '../packages/portal/src/components/[A-Z]*.vue'
          }
        ].concat([
          'Account',
          'Content',
          'Download',
          'Entity',
          'Error',
          'Generic',
          'Home',
          'Image',
          'Item',
          'Landing',
          'Page',
          'Related',
          'Search',
          'Set',
          'Share',
          'Stories',
          'Story',
          'Text',
          'Theme',
          'User'
        ].map((name) => ({
          name,
          components: `../packages/portal/src/components/${name.toLowerCase()}/[A-Z]*.vue`
        })))
      },
      {
        name: 'DS4CH',
        sections: [{
          name: 'DS4CH',
          components: '../packages/portal/src/components/DS4CH/[A-Z]*.vue'
        }]
      }
    ],
    assetsDir: '../packages/style',
    skipComponentsWithoutExample: true,
    require: [
      resolve(__dirname, '../packages/style/scss/style.scss'),
      resolve(__dirname, './style.scss')
    ],
    renderRootJsx: resolve(__dirname, './styleguide.root.js'),
    template: {
      head: {
        links: [
          // TODO: jsdelivr?
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
