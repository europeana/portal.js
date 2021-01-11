<template>
  <div>
    <div id="viewer" />
  </div>
</template>

<script>
  import uniq from 'lodash/uniq';

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
          },
          requests: {
            postprocessors: [this.postprocessAnnotations]
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

      postprocessAnnotations(url, action) {
        if (action.type !== 'mirador/RECEIVE_ANNOTATION') {
          return;
        }
        this.filterAnnotationResources(action.annotationJson);
        this.coerceAnnotationToCanvasId(action.annotationJson);
        this.dereferenceAnnotationResources(action.annotationJson);
      },

      // Hack to force `on` attribute to canvas ID
      //
      // TODO: remove when API output updated to use canvas ID
      coerceAnnotationToCanvasId(annotationJson) {
        annotationJson.resources = annotationJson.resources.map((resource) => {
          const coercedResource = Object.assign({}, resource);
          coercedResource.on = [].concat(coercedResource.on);
          if (coercedResource.on[0].includes('xywh=')) {
            coercedResource.on[0] = coercedResource.on[0].replace(/^[^#]+/, this.page); // replace up to hash
          }
          return coercedResource;
        });
      },

      // Filter to line-level annotations, and only those with a `char` fragment
      // selector.
      filterAnnotationResources(annotationJson) {
        annotationJson.resources = annotationJson.resources.filter(
          resource => (resource.dcType === 'Line') && (/char=(\d+),(\d+)$/.test(resource.resource['@id'])),
        );
      },

      fetchAnnotationResourcesFulltext(annotationJson) {
        const urls = annotationJson.resources
          .filter(resource => !resource.resource.chars && resource.resource['@id'])
          .map(resource => resource.resource['@id'].split('#')[0]);

        const fulltext = {};

        // TODO: error handling
        const fetches = uniq(urls).map(url => this.$axios.get(url)
          .then(response => response.data)
          .then((data) => {
            if (data.type === 'FullTextResource') fulltext[url] = data.value;
          }));

        return Promise.all(fetches).then(() => fulltext);
      },

      async dereferenceAnnotationResources(annotationJson) {
        const fulltext = await this.fetchAnnotationResourcesFulltext(annotationJson);

        for (const resource of annotationJson.resources) {
          if (resource.resource.chars || !resource.resource['@id']) {
            continue;
          }

          const url = resource.resource['@id'].split('#')[0];
          if (!fulltext[url]) continue;

          const fragment = resource.resource['@id'].split('#')[1];

          resource.resource.chars = fulltext[url];

          if (fragment) {
            const charMatch = fragment.match(/char=(\d+),(\d+)$/);
            if (charMatch) {
              resource.resource.chars = resource.resource.chars.slice(
                Number(charMatch[1]),
                Number(charMatch[2]) + 1,
              );
            }
          }
        }
      },

      fetchImageData(url, pageId) {
        if (!this.manifest) return;

        const page = this.manifest.sequences[0].canvases.filter(canvas => canvas['@id'] === pageId);

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
  @import '../../assets/scss/variables.scss';

  ::v-deep .mirador-thumbnail-nav-canvas:focus {
    outline: 2px solid $blue !important;
  }
  ::v-deep .mirador-thumb-navigation {
    height: 100px !important;
  }
</style>
