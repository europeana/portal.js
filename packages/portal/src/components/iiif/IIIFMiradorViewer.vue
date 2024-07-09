<template>
  <div
    class="iiif-viewer-inner-wrapper h-100 d-flex flex-column"
    :class="{ 'error': iiifError}"
  >
    <IIIFErrorMessage
      v-if="iiifError"
      :provider-url="providerUrl"
    />
    <div
      class="iiif-viewer"
      :class="{ 'error': iiifError}"
      data-qa="IIIF viewer"
    >
      <div
        v-show="isMiradorLoaded"
        id="viewer"
      />
    </div>
  </div>
</template>

<script>
  import camelCase from 'lodash/camelCase';
  import { takeEvery } from 'redux-saga/effects';
  import uniq from 'lodash/uniq';
  import upperFirst from 'lodash/upperFirst';

  export default {
    name: 'IIIFMiradorViewer',

    components: {
      IIIFErrorMessage: () => import('./IIIFErrorMessage.vue')
    },

    props: {
      uri: {
        type: String,
        required: true
      },

      itemId: {
        type: String,
        default: null
      },

      searchQuery: {
        type: String,
        default: null
      },

      providerUrl: {
        type: String,
        default: null
      }
    },

    data() {
      return {
        manifest: null,
        manifestAnnotationTextGranularities: [],
        imageToCanvasMap: {},
        memoisedImageToCanvasMap: false,
        miradorViewer: null,
        showAnnotations: false,
        isMobileViewport: false,
        isMiradorLoaded: process.client ? !!window.Mirador : false,
        miradorViewerPlugins: [
          { component: () => null, saga: this.watchMiradorSetCanvasSaga },
          { component: () => null, saga: this.watchMiradorReceiveAnnotationSaga }
        ],
        proxiedMedia: {},
        iiifError: false
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
              thumbnailNavigationPosition: 'off'
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
            defaultSideBarPanel: this.searchQuery ? 'search' : 'annotations',
            views: [
              { key: 'single' },
              { key: 'book' },
              { key: 'gallery' }
            ]
          },
          language: this.$i18n.locale,
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
          },
          selectedTheme: 'europeana',
          themes: {
            europeana: window.MiradorTheme
          },
          osdConfig: {
            gestureSettingsMouse: {
              scrollToZoom: false
            }
          }
        };

        return options;
      },

      iiifPresentationApiVersion() {
        return this.iiifPresentationApiVersionFromContext(this.manifest?.['@context']);
      },

      numberOfPages() {
        if (this.iiifPresentationApiVersion === 2) {
          return this.manifest.sequences?.reduce((memo, sequence) => memo + sequence.canvases.length, 0);
        } else if (this.iiifPresentationApiVersion === 3) {
          return this.manifest.items?.filter((item) => item.type === 'Canvas').length;
        } else {
          return 0;
        }
      },

      miradorWindowId() {
        return Object.keys(this.miradorViewer.store.getState().windows)[0];
      },

      searchService() {
        return [].concat(this.manifest?.service || [])
          .find((service) => service['@context'] === 'http://iiif.io/api/search/1/context.json');
      }
    },

    watch: {
      numberOfPages(newVal) {
        if (!this.miradorViewer?.store) {
          return;
        }
        const multiplePages = newVal > 1;
        if (multiplePages) {
          if (!this.isMobileViewport) {
            const thumbnailNavigationPosition = 'far-right';
            const actionSetThumbnailPosition = window.Mirador.actions.setWindowThumbnailPosition(this.miradorWindowId, thumbnailNavigationPosition);
            this.miradorViewer.store.dispatch(actionSetThumbnailPosition);
          }
          const topMenuOptions = {
            allowTopMenuButton: true
          };
          const actionAllowTopMenuButton = window.Mirador.actions.updateWindow(this.miradorWindowId, topMenuOptions);
          this.miradorViewer.store.dispatch(actionAllowTopMenuButton);
        }
      }
    },

    mounted() {
      this.isMobileViewport = window.innerWidth <= 576;
      this.initMirador();

      // Catch image request failures as Mirador does not handle them
      // TODO: remove when Mirador implements better handling. Issue: https://github.com/ProjectMirador/mirador/issues/3775
      window.addEventListener('unhandledrejection', this.handleFailedManifestImage);
    },

    beforeDestroy() {
      // NOTE: very important to do this, as it cleans up all the
      //       mirador/react/material stuff from the DOM before moving on
      this.miradorViewer.unmount();

      window.removeEventListener('unhandledrejection', this.handleFailedManifestImage);
    },

    methods: {
      async loadMirador() {
        const miradorModule = await import('@europeana/mirador');
        window.Mirador = miradorModule.default;
        window.MiradorTheme = miradorModule.theme;
        this.isMiradorLoaded = true;
      },

      async initMirador() {
        if (!this.isMiradorLoaded) {
          await this.loadMirador();
        }
        this.miradorViewer = window.Mirador.viewer(this.miradorViewerOptions, this.miradorViewerPlugins);
      },

      *watchMiradorSetCanvasSaga() {
        yield takeEvery('mirador/SET_CANVAS', this.watchMiradorSetCanvas);
      },

      *watchMiradorSetCanvas({ canvasId }) {
        this.memoiseImageToCanvasMap();
        this.postUpdatedDownloadLinkMessage(canvasId);
        yield;
      },

      *watchMiradorReceiveAnnotationSaga() {
        yield takeEvery('mirador/RECEIVE_ANNOTATION', this.watchMiradorReceiveAnnotation);
      },

      *watchMiradorReceiveAnnotation(action) {
        this.showSidebarForAnnotations(action.annotationJson);
        yield;
      },

      versioned(fn, args) {
        const versionedFunction = `${fn}V${this.iiifPresentationApiVersion}`;
        if (typeof this[versionedFunction] !== 'function') {
          throw new Error(`Unsupported IIIF Presentation API version ${this.iiifPresentationApiVersion} for function ${fn}`);
        }
        return this[versionedFunction].apply(this, args);
      },

      addAcceptHeaderToPresentationRequests(url, options) {
        if (this.urlIsForEuropeanaPresentationAPI(url) && !url.includes('/search?')) {
          if (!options.headers) {
            options.headers = {};
          }
          options.headers.Accept = 'application/ld+json;profile="http://iiif.io/api/presentation/3/context.json"';
        }
        return options;
      },

      handleError(message, name = 'IIIFManifestError') {
        this.iiifError = true;
        this.miradorViewer.unmount();
        this.$apm?.captureError({
          name,
          message,
          item: this.itemId,
          url: this.uri
        });
      },

      postprocessMiradorRequest(url, action) {
        const fn = `postprocess${upperFirst(camelCase(action.type))}`;
        this[fn]?.(url, action);
      },

      // TODO: rewrite thumbnail URLs to use v3 API
      postprocessMiradorReceiveManifest(url, action) {
        this.manifest = action.manifestJson;
        // Catch when there are no canvases in the manifest
        // TODO: display media available on the record instead
        if (!this.manifest.sequences && !this.manifest.items) {
          this.handleError('No canvases in IIIF manifest');
        }
        if (this.urlIsForEuropeanaPresentationAPI(url)) {
          this.proxyProviderMedia(action.manifestJson);
          this.addAnnotationTextGranularityFilterToManifest(action.manifestJson);
        }
      },

      async postprocessMiradorReceiveAnnotation(url, action) {
        this.showSidebarForAnnotations(action.annotationJson);
        if (this.urlIsForEuropeanaPresentationAPI(url)) {
          this.coerceAnnotationsOnToCanvases(action.annotationJson);
        }
        await this.dereferenceAnnotationResources(action.annotationJson);
      },

      postprocessMiradorReceiveSearch(url, action) {
        if (this.urlIsForEuropeanaPresentationAPI(url)) {
          this.filterSearchHitsByTextGranularity(action.searchJson);
          this.coerceAnnotationsOnToCanvases(action.searchJson);
        }
        this.coerceSearchHitsToBeforeMatchAfter(action.searchJson);
      },

      postprocessMiradorReceiveManifestFailure(url, { error }) {
        this.handleError(error);
      },

      urlIsForEuropeanaPresentationAPI(url) {
        return url.includes('.europeana.eu/presentation/') || url.includes('.eanadev.org/presentation/');
      },

      iiifPresentationApiVersionFromContext(context) {
        const contexts = [].concat(context).filter((context) => !!context);
        if (contexts.some((uri) => uri.includes('://iiif.io/api/presentation/2/context.json'))) {
          return 2;
        } else if (contexts.some((uri) => uri.includes('://iiif.io/api/presentation/3/context.json'))) {
          return 3;
        } else {
          return undefined;
        }
      },

      // Europeana-only
      proxyProviderMedia(manifestJson) {
        for (const canvas of (manifestJson.items || [])) {
          for (const annotationPage of (canvas.items || [])) {
            for (const annotation of (annotationPage.items || [])) {
              if ((annotation.motivation === 'painting') && !annotation.body?.service?.profile?.startsWith('http://iiif.io/api/image/')) {
                this.proxiedMedia[annotation.body.id] = this.$apis.record.mediaProxyUrl(annotation.body.id, this.itemId);
                annotation.body.id = this.proxiedMedia[annotation.body.id];
              }
            }
          }
        }
      },

      // Europeana-only
      addAnnotationTextGranularityFilterToManifest(manifestJson) {
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
        // TODO: remove .toLowerCase() when our IIIF APIs return dcType/textGranularity in lower-case
        searchJson.resources = searchJson.resources.filter(resource => !resource.dcType || (this.manifestAnnotationTextGranularities.includes(resource.dcType.toLowerCase())));
        const filteredResourceIds = searchJson.resources.map(resource => resource['@id']);
        searchJson.hits = searchJson.hits.filter(hit => hit.annotations.some(anno => filteredResourceIds.includes(anno)));
      },

      // Europeana-only
      coerceAnnotationsOnToCanvases(json) {
        // needed due to search endpoint returning weird stuff if v3 format requested
        if (json.items) {
          json.items = json.items.map(this.coerceItemTargetImagesToCanvases);
        } else if (json.resources) {
          json.resources = json.resources.map(this.coerceItemTargetImagesToCanvases);
        }
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

        if (this.searchQuery) {
          const companionWindowId = Object.keys(this.miradorViewer.store.getState().companionWindows)[0];
          let searchId = this.searchService?.id || this.searchService?.['@id'];
          if (!searchId) {
            return;
          }
          searchId = `${searchId}?q=${this.searchQuery}`;

          const actionSearch = window.Mirador.actions.fetchSearch(this.miradorWindowId, companionWindowId, searchId, this.searchQuery);
          this.miradorViewer.store.dispatch(actionSearch);
        }

        const actionShow = (options) => window.Mirador.actions.updateWindow(this.miradorWindowId, options);
        if (!this.isMobileViewport || this.searchQuery) {
          const openSideBarOptions = { allowWindowSideBar: true, sideBarOpen: true };
          this.miradorViewer.store.dispatch(actionShow(openSideBarOptions));
          this.showAnnotations = true;
        } else if (this.isMobileViewport) {
          const allowSideBarOptions = { allowWindowSideBar: true };
          this.miradorViewer.store.dispatch(actionShow(allowSideBarOptions));
        }
      },

      memoiseImageToCanvasMap() {
        if (this.memoisedImageToCanvasMap) {
          return;
        }
        this.versioned('memoiseImageToCanvasMap', arguments);
        this.memoisedImageToCanvasMap = true;
      },

      memoiseImageToCanvasMapV2() {
        this.imageToCanvasMap = (this.manifest.sequences || []).reduce((memo, sequence) => {
          for (const canvas of sequence.canvases) {
            for (const image of canvas.images) {
              memo[image.resource['@id']] = canvas['@id'];
            }
          }
          return memo;
        }, {});
      },

      memoiseImageToCanvasMapV3() {
        this.imageToCanvasMap = (this.manifest.items || []).reduce((memo, canvas) => {
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
        const imageUri = this.proxiedMedia[splitImageId[0]] || splitImageId[0];
        if (this.imageToCanvasMap[imageUri]) {
          return [this.imageToCanvasMap[imageUri], splitImageId[1]].join('#');
        } else {
          return null;
        }
      },

      // HACK to force `target` / `on` attribute to canvas ID, from invalid targetting of image ID
      //
      // TODO: remove when API output updated to use canvas ID.
      //       Affects annotation pages for:
      //       - annotations linked to from Presentation manifests
      //       - annotations with search hits
      coerceItemTargetImagesToCanvases(item) {
        const property = item.on ? 'on' : 'target';
        if (Array.isArray(item[property])) {
          for (let i = 0; i < item[property].length; i = i + 1) {
            const canvas = this.canvasForImage(item[property][i]);
            if (canvas) {
              item[property][i] = canvas;
            }
          }
        } else if (item[property]) {
          const canvas = this.canvasForImage(item[property]);
          if (canvas) {
            item[property] = canvas;
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

      findAnnotationFulltextUrlsV2(annotationJson) {
        return annotationJson.resources
          .filter((resource) => resource.resource && !resource.resource.chars && resource.resource['@id'])
          .map((resource) => resource.resource['@id']);
      },

      findAnnotationFulltextUrlsV3(annotationJson) {
        return annotationJson.items
          .filter((item) => item.body && !item.body.value && item.body.id)
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

      addFulltextToAnnotationsV2(annotationJson, fulltext) {
        for (const resource of annotationJson.resources) {
          if (!resource.resource || resource.resource.chars || !resource.resource['@id']) {
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

      addFulltextToAnnotationsV3(annotationJson, fulltext) {
        for (const item of annotationJson.items) {
          if (!item.body || item.body.value || !item.body.id) {
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

      findDownloadLinkForPageV2(pageId) {
        return (this.manifest.sequences?.[0]?.canvases || [])
          .find(canvas => canvas['@id'] === pageId)
          ?.images?.[0]?.resource?.['@id'];
      },

      findDownloadLinkForPageV3(pageId) {
        return (this.manifest.items || [])
          .find(canvas => canvas.id === pageId)
          ?.items?.[0]?.items?.[0]?.body?.id;
      },

      handleFailedManifestImage(event) {
        // As this could be any unhandled rejection on the page, check if unhandled rejection source is image from manifest
        const failedImageURL = event.reason?.source?.url;
        const failedImageIsInManifest = Object.keys(this.imageToCanvasMap || {}).includes(failedImageURL);

        if (failedImageIsInManifest) {
          this.handleError(event.reason.message, 'IIIFImageError');
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';
  @import '@europeana/style/scss/iiif';

  .iiif-viewer-inner-wrapper {
    background-color: $black;

    &.error {
      overflow: auto;
    }
  }
</style>
