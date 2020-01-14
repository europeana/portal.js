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
        manifest: null,
        MIRADOR_BUILD_PATH: 'https://unpkg.com/mirador@3.0.0-beta.3/dist',
        page: null,
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
        const mirador = Mirador.viewer({ // eslint-disable-line no-undef
          id: 'viewer',
          windows: [{
            manifestId: this.uri,
            thumbnailNavigationPosition: 'far-bottom'
          }],
          window: {
            allowClose: false,
            allowFullscreen: true,
            allowMaximize: false,
            allowTopMenuButton: false,
            allowWindowSideBar: false,
            panels: {
              info: false,
              attribution: false,
              canvas: true,
              // Disabled due to performance issues with many annotations, pending
              // https://github.com/ProjectMirador/mirador/issues/2915
              annotations: false,
              search: false
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

        mirador.store.subscribe(() => {
          const miradorWindow = Object.values(mirador.store.getState().windows)[0]; // only takes one window into account at the moment
          if (!this.manifest) {
            this.manifest = mirador.store.getState().manifests[miradorWindow.manifestId].json;
          }

          if (miradorWindow.canvasId !== this.page) {
            this.page = miradorWindow.canvasId;
            this.fetchImageData(this.uri, this.page);
          }
        });
      });
    },

    methods: {
      fetchImageData(url, pageId) {
        const page = this.manifest.sequences[0].canvases.filter((item) => {
          return item['@id'] === pageId;
        });

        if (page && page[0]) {
          window.parent.postMessage({ 'event': 'updateDownloadLink', 'id': page[0].images[0].resource['@id'] }, '*');
        }
      }
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
  @import "./assets/scss/variables.scss";

  /deep/ .mirador-thumbnail-nav-canvas:focus {
    outline: 2px solid $blue !important;
  }
</style>

