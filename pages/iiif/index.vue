<template>
  <div>
    <div id="viewer" />
  </div>
</template>

<script>
  export default {
    layout: 'minimal',

    asyncData({ query }) {
      return {
        uri: query.uri
      };
    },

    data() {
      return {
        manifest: null,
        MIRADOR_BUILD_PATH: 'https://unpkg.com/mirador@3.0.0/dist',
        page: null,
        uri: null,
        mirador: null,
        miradorStoreManifestJsonUnsubscriber: () => {}
      };
    },

    computed: {
      miradorViewerOptions() {
        // Doc: https://github.com/ProjectMirador/mirador/blob/master/src/config/settings.js
        const options = {
          id: 'viewer',
          windows: [
            {
              manifestId: this.uri,
              thumbnailNavigationPosition: 'far-bottom'
            }
          ],
          window: {
            allowClose: false,
            allowFullscreen: true,
            allowMaximize: false,
            allowTopMenuButton: false,
            allowWindowSideBar: true,
            sideBarOpenByDefault: false,
            panels: {
              info: false,
              attribution: false,
              canvas: false,
              annotations: true,
              search: true
            },
            defaultSideBarPanel: 'annotations'
          },
          workspace: {
            showZoomControls: true,
            type: 'mosaic'
          },
          workspaceControlPanel: {
            enabled: false
          }
        };

        return options;
      }
    },

    mounted() {
      this.$nextTick(() => {
        this.mirador = window.Mirador.viewer(this.miradorViewerOptions);
        this.miradorStoreManifestJsonUnsubscriber = this.mirador.store.subscribe(this.miradorStoreManifestJsonListener);
      });
    },

    methods: {
      miradorStoreManifestJsonListener() {
        const miradorWindow = Object.values(this.mirador.store.getState().windows)[0]; // only takes one window into account at the moment
        if (miradorWindow) {
          const miradorManifest = this.mirador.store.getState().manifests[miradorWindow.manifestId];
          if (miradorManifest) {
            this.manifest = miradorManifest.json;
            if (miradorWindow.canvasId !== this.page) {
              this.page = miradorWindow.canvasId;
              this.fetchImageData(this.uri, this.page);
            }
          }
        }
      },
      fetchImageData(url, pageId) {
        if (!this.manifest) return;

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
        title: this.$pageHeadTitle('IIIF'),
        script: [
          { src: `${this.MIRADOR_BUILD_PATH}/mirador.min.js` }
        ]
      };
    }
  };
</script>

<style lang="scss" scoped>
  @import './assets/scss/variables.scss';

  /deep/ .mirador-thumbnail-nav-canvas:focus {
    outline: 2px solid $blue !important;
  }
  /deep/ .mirador-thumb-navigation {
    height: 100px !important;
  }
</style>
