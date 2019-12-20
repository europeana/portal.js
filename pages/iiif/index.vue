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
        MIRADOR_BUILD_PATH: 'https://unpkg.com/mirador@3.0.0-beta.3/dist',
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
        // Doc: https://github.com/ProjectMirador/mirador/blob/master/src/config/settings.js
        Mirador.viewer({ // eslint-disable-line no-undef
          id: 'viewer',
          windows: [{
            manifestId: this.uri,
            thumbnailNavigationPosition: 'far-bottom'
          }],
          window: {
            allowClose: false,
            allowFullscreen: true,
            allowMaximize: false,
            panels: {
              info: true,
              attribution: true,
              canvas: true,
              // Disabled due to performance issues with many annotations, pending
              // https://github.com/ProjectMirador/mirador/issues/2915
              annotations: false,
              search: true
            }
          },
          workspace: {
            showZoomControls: true,
            type: 'mosaic'
          },
          workspaceControlPanel: {
            enabled: false
          }
        });
      });
    },

    head() {
      return {
        title: 'IIIF',

        script: [
          { src: `${this.MIRADOR_BUILD_PATH}/mirador.min.js` }
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
