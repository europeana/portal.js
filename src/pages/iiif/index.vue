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
        uri: query.uri,
        searchQuery: query.query
      };
    },

    data() {
      return {
        manifest: null,
        MIRADOR_BUILD_PATH: 'https://unpkg.com/mirador@3.0.0/dist',
        page: null,
        uri: null,
        imageToCanvasMap: {},
        mirador: null,
        showAnnotations: false,
        searchQuery: null,
        miradorStoreManifestJsonUnsubscriber: () => {}
      };
    },

    computed: {
      miradorViewerOptions() {
        // Doc: https://github.com/ProjectMirador/mirador/blob/v3.0.0/src/config/settings.js
        const options = {
          id: 'viewer',
          windows: [
            {
              manifestId: this.uri,
              thumbnailNavigationPosition: 'far-bottom',
              ... this.showAnnotations && { defaultSearchQuery: this.searchQuery }
            }
          ],
          window: {
            allowClose: false,
            allowFullscreen: true,
            allowMaximize: false,
            allowTopMenuButton: false,
            allowWindowSideBar: this.showAnnotations && true,
            sideBarOpen: this.showAnnotations && true,
            panels: {
              info: false,
              attribution: false,
              canvas: false,
              annotations: true,
              search: true
            },
            defaultSideBarPanel: this.showAnnotations && this.searchQuery ? 'search' : 'annotations'
          },
          workspace: {
            showZoomControls: true,
            type: 'mosaic'
          },
          workspaceControlPanel: {
            enabled: false
          },
          requests: {
            postprocessors: [this.postprocessMiradorRequest]
          }
        };

        return options;
      }
    },

    watch: {
      showAnnotations() {
        this.mirador = window.Mirador.viewer(this.miradorViewerOptions);
        this.miradorStoreManifestJsonUnsubscriber = this.mirador.store.subscribe(this.miradorStoreManifestJsonListener);
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
            if (miradorWindow.canvasId && (miradorWindow.canvasId !== this.page)) {
              this.memoiseImageToCanvasMap();
              this.page = miradorWindow.canvasId;
              this.fetchImageData(this.uri, this.page);
            }
          }
        }
      },

      postprocessMiradorRequest(url, action) {
        switch (action.type) {
        case 'mirador/RECEIVE_MANIFEST':
          this.postprocessMiradorManifest(url, action);
          break;
        case 'mirador/RECEIVE_ANNOTATION':
          if ((action.annotationJson.resources.length > 0)) {
            if (!this.showAnnotations) {
              this.showAnnotations = true;
            }
          }
          this.postprocessMiradorAnnotation(url, action);
          break;
        case 'mirador/RECEIVE_SEARCH':
          this.postprocessMiradorSearch(url, action);
          break;
        }
      },

      postprocessMiradorManifest(url, action) {
        this.addTextGranularityFilterToManifest(action.manifestJson);
      },

      postprocessMiradorAnnotation(url, action) {
        this.coerceResourcesOnToCanvases(action.annotationJson);
        this.dereferenceAnnotationResources(action.annotationJson);
      },

      postprocessMiradorSearch(url, action) {
        this.filterSearchHitsByTextGranularity(action.searchJson);
        this.coerceResourcesOnToCanvases(action.searchJson);
        this.coerceSearchHitsToBeforeMatchAfter(action.searchJson);
      },

      addTextGranularityFilterToManifest(manifestJson, textGranularity = 'Line') {
        const europeanaIiifPattern = /^https?:\/\/iiif\.europeana\.eu\/presentation\/[^/]+\/[^/]+\/manifest$/;
        if (!europeanaIiifPattern.test(manifestJson['@id'])) {
          return;
        }

        // Add textGranularity filter to "otherContent" URIs
        for (const sequence of manifestJson.sequences) {
          for (const canvas of (sequence.canvases || [])) {
            const otherContent = canvas.otherContent || [];
            for (let i = 0; i < otherContent.length; i = i + 1) {
              const otherContentLink = otherContent[i];
              const paramSeparator = otherContentLink.includes('?') ? '&' : '?';
              otherContent[i] = `${otherContentLink}${paramSeparator}textGranularity=${textGranularity}`;
            }
          }
        }

        // Add textGranularity filter to search service URI
        //
        // NOTE: this does not work, due to Mirador not expecting a service URI
        //       to already contain '?' with parameters.
        //       https://github.com/ProjectMirador/mirador/blob/v3.0.0/src/components/SearchPanelControls.js#L91
        //
        //       If it in future becomes possible to use this, then `filterSearchHitsByTextGranularity`
        //       becomes redundant and may be removed, as pre-filtering on the
        //       service side is preferrable.
        //
        // if ((manifestJson.service || {}).profile === 'http://iiif.io/api/search/1/search') {
        //   const paramSeparator = manifestJson.service['@id'].includes('?') ? '&' : '?';
        //   manifestJson.service['@id'] = `${manifestJson.service['@id']}${paramSeparator}textGranularity=${textGranularity}`;
        // }
      },

      filterSearchHitsByTextGranularity(searchJson, textGranularity = 'Line') {
        searchJson.resources = searchJson.resources.filter(resource => !resource.dcType || (resource.dcType === textGranularity));
        const filteredResourceIds = searchJson.resources.map(resource => resource['@id']);
        searchJson.hits = searchJson.hits.filter(hit => hit.annotations.some(anno => filteredResourceIds.includes(anno)));
      },

      coerceResourcesOnToCanvases(json) {
        json.resources = json.resources.map(this.coerceResourceOnImagesToCanvases);
      },

      memoiseImageToCanvasMap() {
        this.imageToCanvasMap = this.manifest.sequences.reduce((memo, sequence) => {
          for (const canvas of sequence.canvases) {
            for (const image of canvas.images) {
              memo[image.resource['@id']] = canvas['@id'];
            }
          }
          return memo;
        }, {});
      },

      canvasForImage(imageId) {
        const splitImageId = imageId.split('#');
        if (this.imageToCanvasMap[splitImageId[0]]) {
          return [this.imageToCanvasMap[splitImageId[0]], splitImageId[1]].join('#');
        }
      },

      // HACK to force `on` attribute to canvas ID, from invalid targetting of image ID
      //
      // TODO: remove when API output updated to use canvas ID.
      //       Affects annotation lists for:
      //       - full pages of annotations linked to from otherContent in Presentation manifests
      //       - lists of annotations with search hits
      coerceResourceOnImagesToCanvases(resource) {
        if (Array.isArray(resource.on)) {
          for (let i = 0; i < resource.on.length; i = i + 1) {
            const canvas = this.canvasForImage(resource.on[i]);
            if (canvas) {
              resource.on[i] = canvas;
            }
          }
        } else {
          const canvas = this.canvasForImage(resource.on);
          if (canvas) {
            resource.on = canvas;
          }
        }

        return resource;
      },

      // HACK to flatten oa:TextQuoteSelector hit selectors to before/match/after
      // hits, as Mirador 3.0.0 does not support oa:TextQuoteSelector style.
      coerceSearchHitsToBeforeMatchAfter(searchJson) {
        const hits = [];

        for (const hit of (searchJson.hits || [])) {
          if (hit.selectors) {
            for (const selector of hit.selectors) {
              hits.push({
                '@type': hit['@type'],
                annotations: hit.annotations,
                before: selector.prefix,
                after: selector.suffix,
                match: selector.exact
              });
            }
          } else {
            hits.push(hit);
          }
        }

        searchJson.hits = hits;
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
            if (data.type === 'FullTextResource') {
              fulltext[url] = data.value;
            }
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
          if (!fulltext[url]) {
            continue;
          }

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
        if (!this.manifest) {
          return;
        }

        const page = this.manifest.sequences[0].canvases.filter(canvas => canvas['@id'] === pageId);

        if (page && page[0]) {
          window.parent.postMessage({ 'event': 'updateDownloadLink', 'id': page[0].images[0].resource['@id'] }, window.location.origin);
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
