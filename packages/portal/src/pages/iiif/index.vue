<template>
  <div>
    <div id="viewer" />
  </div>
</template>

<script>
  import camelCase from 'lodash/camelCase';
  import uniq from 'lodash/uniq';
  import upperFirst from 'lodash/upperFirst';

  export default {
    name: 'IIIFPage',

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
        manifestAnnotationTextGranularities: [],
        MIRADOR_BUILD_PATH: 'https://cdn.jsdelivr.net/npm/mirador@3.3.0/dist',
        page: null,
        imageToCanvasMap: {},
        mirador: null,
        showAnnotations: false,
        miradorStoreManifestJsonUnsubscriber: () => {}
      };
    },

    head() {
      return {
        meta: [
          { hid: 'title', name: 'title', content: 'IIIF' }
        ],
        script: [
          { src: `${this.MIRADOR_BUILD_PATH}/mirador.min.js` }
        ]
      };
    },

    computed: {
      miradorViewerOptions() {
        // Doc: https://github.com/ProjectMirador/mirador/blob/v3.3.0/src/config/settings.js
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
            allowWindowSideBar: false,
            sideBarOpen: false,
            panels: {
              info: false,
              attribution: false,
              canvas: false,
              annotations: true,
              search: true
            },
            defaultSideBarPanel: this.searchQuery ? 'search' : 'annotations'
          },
          workspace: {
            showZoomControls: true,
            type: 'mosaic'
          },
          workspaceControlPanel: {
            enabled: false
          },
          annotations: {
            filteredMotivations: ['transcribing', 'supplementing', 'oa:commenting', 'oa:tagging', 'sc:painting', 'commenting', 'tagging']
          },
          requests: {
            preprocessors: [this.addAcceptHeaderToPresentationRequests],
            postprocessors: [this.postprocessMiradorRequest]
          }
        };

        return options;
      },

      iiifPresentationApiVersion() {
        return this.iiifPresentationApiVersionFromContext(this.manifest['@context']);
      }
    },

    mounted() {
      this.$nextTick(() => {
        this.mirador = window.Mirador.viewer(this.miradorViewerOptions);
        this.miradorStoreManifestJsonUnsubscriber = this.mirador.store.subscribe(this.miradorStoreManifestJsonListener);
      });
    },

    methods: {
      versioned(fn, args) {
        const versionedFunction = `${fn}${this.iiifPresentationApiVersion}`;
        if (typeof this[versionedFunction] !== 'function') {
          throw new Error(`Unsupported IIIF Presentation API version ${this.iiifPresentationApiVersion} for function ${fn}`);
        }
        return this[versionedFunction].apply(this, args);
      },

      miradorStoreManifestJsonListener() {
        // only takes one window into account at the moment
        const miradorWindow = Object.values(this.mirador.store.getState().windows)[0];
        if (miradorWindow) {
          const miradorManifest = this.mirador.store.getState().manifests[miradorWindow.manifestId];
          if (miradorManifest) {
            this.manifest = miradorManifest.json;
            if (miradorWindow.canvasId && (miradorWindow.canvasId !== this.page)) {
              this.memoiseImageToCanvasMap();
              this.page = miradorWindow.canvasId;
              this.postUpdatedDownloadLinkMessage(this.page);
            }
          }
        }
      },

      addAcceptHeaderToPresentationRequests(url, options) {
        if (this.urlIsForEuropeanaPresentationAPI(url)) {
          if (!options.headers) {
            options.headers = {};
          }
          options.headers.Accept = 'application/ld+json;profile="http://iiif.io/api/presentation/3/context.json"';
        }
        return options;
      },

      postprocessMiradorRequest(url, action) {
        const fn = `postprocess${upperFirst(camelCase(action.type))}`;
        this[fn] && this[fn](url, action);
      },

      // TODO: rewrite thumbnail URLs to use v3 API
      postprocessMiradorReceiveManifest(url, action) {
        if (this.urlIsForEuropeanaPresentationAPI(url)) {
          this.addTextGranularityFilterToManifest(action.manifestJson);
        }
      },

      postprocessMiradorReceiveAnnotation(url, action) {
        this.showSidebarForAnnotations(action.annotationJson);
        if (this.urlIsForEuropeanaPresentationAPI(url)) {
          this.coerceAnnotationsOnToCanvases(action.annotationJson);
        }
        this.dereferenceAnnotationResources(action.annotationJson);
      },

      postprocessMiradorReceiveSearch(url, action) {
        if (this.urlIsForEuropeanaPresentationAPI(url)) {
          this.filterSearchHitsByTextGranularity(action.searchJson);
          this.coerceAnnotationsOnToCanvases(action.searchJson);
        }
        this.coerceSearchHitsToBeforeMatchAfter(action.searchJson);
      },

      urlIsForEuropeanaPresentationAPI(url) {
        return url.includes('.europeana.eu/presentation/') || url.includes('.eanadev.org/presentation/');
      },

      iiifPresentationApiVersionFromContext(context) {
        if ([].concat(context).includes('http://iiif.io/api/presentation/2/context.json')) {
          return 2;
        } else if ([].concat(context).includes('http://iiif.io/api/presentation/3/context.json')) {
          return 3;
        } else {
          return undefined;
        }
      },

      // Europeana-only
      addTextGranularityFilterToManifest(manifestJson) {
        // Memoise granularities we will accept for this manifest, for later filtering
        const manifestAnnotationTextGranularities = [];

        for (const item of manifestJson.items) {
          for (const annotation of item.annotations || []) {
            let textGranularity = 'line';
            if (annotation.textGranularity && !annotation.textGranularity.includes(textGranularity)) {
              textGranularity = annotation.textGranularity[0];
            }
            if (!manifestAnnotationTextGranularities.includes(textGranularity)) {
              manifestAnnotationTextGranularities.push(textGranularity);
            }

            const paramSeparator = annotation.id.includes('?') ? '&' : '?';
            annotation.id = `${annotation.id}${paramSeparator}textGranularity=${textGranularity}`;
          }
        }

        this.manifestAnnotationTextGranularities = manifestAnnotationTextGranularities;

        // Add textGranularity filter to search service URI
        //
        // NOTE: this does not work, due to Mirador not expecting a service URI
        //       to already contain '?' with parameters.
        //       https://github.com/ProjectMirador/mirador/blob/v3.0.0/src/components/SearchPanelControls.js#L91
        //
        //       If it in future becomes possible to use this, then `filterSearchHitsByTextGranularity`
        //       becomes redundant and may be removed, as pre-filtering on the
        //       service side is preferrable.
        //  TODO: open PR on Mirador repo to handle this better
        //
        // if ((manifestJson.service || {}).profile === 'http://iiif.io/api/search/1/search') {
        //   const paramSeparator = manifestJson.service['@id'].includes('?') ? '&' : '?';
        //   manifestJson.service['@id'] = `${manifestJson.service['@id']}${paramSeparator}textGranularity=${textGranularity}`;
        // }
      },

      // Europeana-only
      filterSearchHitsByTextGranularity(searchJson) {
        searchJson.resources = searchJson.resources.filter(resource => !resource.dcType || (this.manifestAnnotationTextGranularities.includes(resource.dcType)));
        const filteredResourceIds = searchJson.resources.map(resource => resource['@id']);
        searchJson.hits = searchJson.hits.filter(hit => hit.annotations.some(anno => filteredResourceIds.includes(anno)));
      },

      // Europeana-only
      coerceAnnotationsOnToCanvases(json) {
        json.items = json.items.map(this.coerceItemTargetImagesToCanvases);
      },

      showSidebarForAnnotations(json) {
        if (this.showAnnotations) {
          return;
        }

        let annotations = [];
        if (this.iiifPresentationApiVersion === 2) {
          annotations = json.resources;
        } else if (this.iiifPresentationApiVersion === 3) {
          annotations = json.items;
        }
        if (annotations.length === 0) {
          return;
        }

        const windowId = Object.keys(this.mirador.store.getState().windows)[0];
        if (this.searchQuery) {
          const companionWindowId = Object.keys(this.mirador.store.getState().companionWindows)[0];
          const searchId = `${this.manifest.service['@id']}?q=${this.searchQuery}`;

          const actionSearch = window.Mirador.actions.fetchSearch(windowId, companionWindowId, searchId, this.searchQuery);
          this.mirador.store.dispatch(actionSearch);
        }
        const action = window.Mirador.actions.toggleWindowSideBar(windowId);
        this.mirador.store.dispatch(action);
        this.showAnnotations = true;

        this.miradorViewerOptions.window.allowWindowSideBar = true;
        const actionShow = window.Mirador.actions.updateConfig(this.miradorViewerOptions);
        this.mirador.store.dispatch(actionShow);
      },

      memoiseImageToCanvasMap() {
        return this.versioned('memoiseImageToCanvasMap', arguments);
      },

      memoiseImageToCanvasMap2() {
        this.imageToCanvasMap = this.manifest.sequences.reduce((memo, sequence) => {
          for (const canvas of sequence.canvases) {
            for (const image of canvas.images) {
              memo[image.resource['@id']] = canvas['@id'];
            }
          }
          return memo;
        }, {});
      },

      memoiseImageToCanvasMap3() {
        this.imageToCanvasMap = this.manifest.items.reduce((memo, canvas) => {
          for (const annopage of canvas.items) {
            for (const anno of annopage.items) {
              if (anno.type === 'Annotation' && anno.body?.type === 'Image') {
                memo[anno.body.id] = anno.target;
              }
            }
          }
          return memo;
        }, {});
      },

      canvasForImage(imageId) {
        const splitImageId = imageId.split('#');
        if (this.imageToCanvasMap[splitImageId[0]]) {
          return [this.imageToCanvasMap[splitImageId[0]], splitImageId[1]].join('#');
        } else {
          return null;
        }
      },

      // HACK to force `target` attribute to canvas ID, from invalid targetting of image ID
      //
      // TODO: remove when API output updated to use canvas ID.
      //       Affects annotation pages for:
      //       - annotations linked to from Presentation manifests
      //       - annotations with search hits
      coerceItemTargetImagesToCanvases(item) {
        if (Array.isArray(item.target)) {
          for (let i = 0; i < item.target.length; i = i + 1) {
            const canvas = this.canvasForImage(item.target[i]);
            if (canvas) {
              item.target[i] = canvas;
            }
          }
        } else {
          const canvas = this.canvasForImage(item.target);
          if (canvas) {
            item.target = canvas;
          }
        }

        return item;
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

      findAnnotationFulltextUrls2(annotationJson) {
        return annotationJson.resources
          .filter((resource) => !resource.resource.chars && resource.resource['@id'])
          .map((resource) => resource.resource['@id']);
      },

      findAnnotationFulltextUrls3(annotationJson) {
        return annotationJson.items
          .filter((item) => !item.body.value && item.body.id)
          .map((item) => item.body.id);
      },

      findAnnotationFulltextUrls() {
        return this.versioned('findAnnotationFulltextUrls', arguments);
      },

      fetchAnnotationResourcesFulltext(annotationJson) {
        const urls = this.findAnnotationFulltextUrls(annotationJson)
          .map((url) => url.split('#')[0]);

        const fulltext = {};

        // TODO: error handling
        const fetches = uniq(urls).map((url) => this.$axios.get(url)
          .then((response) => response.data)
          .then((data) => {
            if (['FullTextResource', 'TextualBody'].includes(data.type)) {
              fulltext[url] = data.value;
            }
          }));

        return Promise.all(fetches).then(() => fulltext);
      },

      async dereferenceAnnotationResources(annotationJson) {
        const fulltext = await this.fetchAnnotationResourcesFulltext(annotationJson);
        this.addFulltextToAnnotations(annotationJson, fulltext);
      },

      addFulltextToAnnotations() {
        return this.versioned('addFulltextToAnnotations', arguments);
      },

      addFulltextToAnnotations2(annotationJson, fulltext) {
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
                Number(charMatch[2]) + 1
              );
            }
          }
        }
      },

      addFulltextToAnnotations3(annotationJson, fulltext) {
        for (const item of annotationJson.items) {
          if (item.body.value || !item.body.id) {
            continue;
          }

          const url = item.body.id.split('#')[0];
          if (!fulltext[url]) {
            continue;
          }

          const fragment = item.body.id.split('#')[1];

          let text = fulltext[url];
          if (fragment) {
            const charMatch = fragment.match(/char=(\d+),(\d+)$/);
            if (charMatch) {
              text = text.slice(
                Number(charMatch[1]),
                Number(charMatch[2]) + 1
              );
            }
          }
          item.body = {
            value: text,
            type: 'TextualBody',
            language: annotationJson.language,
            format: 'text/plain'
          };
        }
      },

      postUpdatedDownloadLinkMessage(pageId) {
        if (!this.manifest) {
          return;
        }

        const link = this.findDownloadLinkForPage(pageId);

        if (link) {
          window.parent.postMessage({ event: 'updateDownloadLink', id: link }, window.location.origin);
        }
      },

      findDownloadLinkForPage() {
        return this.versioned('findDownloadLinkForPage', arguments);
      },

      findDownloadLinkForPage2(pageId) {
        return this.manifest.sequences[0].canvases
          .find(canvas => canvas['@id'] === pageId)
          ?.images?.[0]?.resource?.['@id'];
      },

      findDownloadLinkForPage3(pageId) {
        return this.manifest.items
          .find(canvas => canvas.id === pageId)
          ?.items?.[0]?.items?.[0]?.body?.id;
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@/assets/scss/variables';

  ::v-deep .mirador-thumbnail-nav-canvas:focus {
    outline: 2px solid $blue !important;
  }

  ::v-deep .mirador-thumb-navigation {
    height: 100px !important;
  }
</style>
