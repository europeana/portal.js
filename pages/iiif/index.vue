<template>
  <div>
    <div id="viewer" />
  </div>
</template>

<script>
  export default {
    layout: 'minimal',

    data() {
      return {
        MIRADOR_BUILD_PATH: 'https://unpkg.com/mirador@2.7.2/dist',
        uri: null
      };
    },

    asyncData({ query }) {
      return {
        uri: query.uri
      };
    },

    mounted() {
      this.$nextTick(() => {
        Mirador({ // eslint-disable-line no-undef
          id: 'viewer',
          buildPath: `${this.MIRADOR_BUILD_PATH}/`,
          data: [
            { manifestUri: this.uri }
          ],
          mainMenuSettings: {
            show: false
          },
          windowObjects: [
            {
              loadedManifest: this.uri,
              viewType: 'BookView',
              displayLayout: false,
              bottomPanel: true,
              sidePanel: false,
              annotationLayer: false
            }
          ]
        });
      });
    },

    head() {
      return {
        title: 'IIIF',

        script: [
          { src: `${this.MIRADOR_BUILD_PATH}/mirador.js` }
        ],

        link: [
          { rel: 'stylesheet', href: `${this.MIRADOR_BUILD_PATH}/css/mirador-combined.css` }
        ]
      };
    }
  };
</script>

<style lang="scss" scoped>
  #viewer {
    width: 100%;
    height: 100%;
    position: fixed;
  }
</style>
