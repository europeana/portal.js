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

        mirador.store.subscribe(() => {
          const state = mirador.store.getState().windows;
          if (Object.values(state)[0].canvasId !== this.page) {
            this.page = Object.values(state)[0].canvasId;
            this.fetchImageData(this.uri, this.page);
          }
        });
      });
    },

    methods: {
      async fetchImageData(url, pageId) {
        if (!this.manifest) {
          const response = await fetch(url);
          const manifest = await response.json();
          this.manifest = manifest;
        }

        const page = this.manifest.sequences[0].canvases.filter((item) => {
          return item['@id'] === pageId;
        });

        if (page && page[0]) {
          window.parent.postMessage({ 'event': 'updateDownloadLink', 'data': page[0].images[0].resource['@id'] }, '*');
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
