<template>
  <div
    class="iiif-viewer"
    data-qa="IIIF viewer"
  >
    <div id="viewer" />
  </div>
</template>

<script>
  import camelCase from 'lodash/camelCase';
  import uniq from 'lodash/uniq';
  import upperFirst from 'lodash/upperFirst';

  export default {
    name: 'IIIFViewer',

    props: {
      uri: {
        type: String,
        required: true
      },

      searchQuery: {
        type: String,
        default: null
      }
    },

    data() {
      return {
        MIRADOR_BUILD_PATH: 'https://cdn.jsdelivr.net/npm/mirador@3.3.0/dist',
        manifest: null,
        manifestAnnotationTextGranularities: [],
        page: null,
        imageToCanvasMap: {},
        memoisedImageToCanvasMap: false,
        mirador: null,
        showAnnotations: false,
        miradorStoreManifestJsonUnsubscriber: () => {},
        isMobileViewport: false
      };
    },

    head() {
      return {
        script: [
          {
            hid: 'mirador',
            src: `${this.MIRADOR_BUILD_PATH}/mirador.min.js`,
            defer: true,
            callback: this.initMirador
          }
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
            europeana: {
              palette: {
                type: 'light',
                primary: {
                  main: '#0a72cc'
                },
                secondary: {
                  main: '#0a72cc'
                },
                shades: {
                  dark: '#000000',
                  main: 'rgba(255 255 255 / 90%)',
                  light: '#ffffff'
                },
                error: {
                  main: '#e02020'
                },
                notification: { // Color used in MUI Badge dots
                  main: '#0a72cc'
                },
                action: {
                  hover: '#ffffff',
                  hoverOpacity: 0,
                  selected: 'transparent',
                  focus: 'transparent'
                }
              },
              typography: {
                fontFamily: ['Open Sans', 'Arial', 'sans-serif'],
                body1: {
                  fontSize: '1rem',
                  letterSpacing: '0',
                  lineHeight: '1.5',
                  borderBottom: '0 !important' // no border on view and thumbnail buttons
                },
                body2: {
                  fontSize: '1rem',
                  letterSpacing: '0',
                  lineHeight: '1.5'
                },
                h2: { // item title
                  textAlign: 'center',
                  fontSize: '1.25rem !important',
                  ['@media (min-width:576px)']: {
                    fontSize: '1.5rem !important'
                  }
                },
                subtitle1: { // sidebar annotation and search title
                  fontSize: '1.125rem'
                }
              },
              overrides: {
                Mui: {
                  disabled: { // example: disabled pagination buttons
                    color: '#d8d8d8'
                  },
                  selected: { // example: selected view button
                    color: '#0a72cc'
                  }
                },
                MuiAutocomplete: {
                  input: {
                    minWidth: '130px !important'
                  }
                },
                MuiButtonBase: {
                  root: {
                    color: '#000000',
                    backgroundColor: 'transparent',
                    '&:hover, &:hover svg': {
                      color: '#0a72cc'
                    },
                    '&:focus-visible': {
                      outline: '2px solid #0a72cc',
                      outlineOffset: '-2px'
                    }
                  }
                },
                MuiButton: {
                  contained: { // example: button on modal when no search results
                    color: '#0a72cc',
                    boxShadow: 'none',
                    backgroundColor: 'transparent',
                    fontSize: '0.875rem',
                    textTransform: 'uppercase',
                    fontWeight: '600',
                    padding: '0 1rem',
                    border: '1px solid #0a72cc',
                    borderRadius: '0.25rem',
                    '&:hover': {
                      color: '#ffffff',
                      boxShadow: 'none',
                      backgroundColor: '#0a72cc'
                    }
                  }
                },
                MuiChip: { // example: clear search input
                  outlinedSecondary: {
                    border: '0',
                    color: '#4d4d4d'
                  },
                  deleteIconOutlinedColorSecondary: {
                    color: '#4d4d4d'
                  }
                },
                MuiIconButton: {
                  root: {
                    color: '#000000',
                    backgroundColor: 'transparent',
                    '&:hover': {
                      color: '#0a72cc'
                    }
                  }
                },
                MuiInput: { // example: search input
                  formControl: {
                    border: '1px solid #d8d8d8 !important',
                    borderRadius: '6px',
                    padding: '0.25rem 2rem 0.25rem 0.75rem !important',
                    '&.Mui-focused': {
                      borderColor: '#0a72cc !important'
                    }
                  },
                  underline: {
                    '&:before, &:after': {
                      border: '0'
                    },
                    '&:hover:not(.Mui-disabled):before': {
                      border: '0'
                    }
                  }
                },
                MuiInputLabel: { // example: search input label/placeholder
                  formControl: {
                    margin: '0.25rem 2rem 0.25rem 0.75rem',
                    '&.MuiInputLabel-shrink': {
                      transform: 'translate(0, 0) scale(0.75)'
                    }
                  }
                },
                MuiTab: {
                  textColorPrimary: {
                    color: '#000000'
                  }
                },
                MuiToolbar: {
                  root: {
                    borderTop: '0 !important'
                  }
                },
                MuiTooltip: {
                  tooltip: {
                    backgroundColor: '#000000',
                    fontSize: '0.875rem',
                    padding: '0.625rem'
                  }
                },
                MuiTouchRipple: { // hide grey circle on focus
                  root: {
                    display: 'none'
                  }
                }
              }
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
        return Object.keys(this.mirador.store.getState().windows)[0];
      },

      searchService() {
        return [].concat(this.manifest?.service || [])
          .find((service) => service['@context'] === 'http://iiif.io/api/search/1/context.json');
      },

      itemId() {
        if (!this.urlIsForEuropeanaPresentationAPI(this.uri)) {
          return null;
        }
        return new URL(this.uri).pathname.replace('/presentation', '').replace('/manifest', '');
      }
    },

    watch: {
      numberOfPages(newVal) {
        const multiplePages = newVal > 1;
        if (multiplePages) {
          if (!this.isMobileViewport) {
            const thumbnailNavigationPosition = 'far-right';
            const actionSetThumbnailPosition = window.Mirador.actions.setWindowThumbnailPosition(this.miradorWindowId, thumbnailNavigationPosition);
            this.mirador.store.dispatch(actionSetThumbnailPosition);
          }
          const topMenuOptions = {
            allowTopMenuButton: true
          };
          const actionAllowTopMenuButton = window.Mirador.actions.updateWindow(this.miradorWindowId, topMenuOptions);
          this.mirador.store.dispatch(actionAllowTopMenuButton);
        }
      }
    },

    mounted() {
      this.isMobileViewport = window.innerWidth <= 576;
    },

    methods: {
      initMirador() {
        this.mirador = window.Mirador.viewer(this.miradorViewerOptions);
        this.miradorStoreManifestJsonUnsubscriber = this.mirador.store.subscribe(this.miradorStoreManifestJsonListener);
      },

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
        if (this.urlIsForEuropeanaPresentationAPI(url) && !url.includes('/search?')) {
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
          this.proxyProviderMedia(action.manifestJson);
          this.addAnnotationTextGranularityFilterToManifest(action.manifestJson);
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
      proxyProviderMedia(manifestJson) {
        for (const canvas of (manifestJson.items || [])) {
          for (const annotationPage of (canvas.items || [])) {
            for (const annotation of (annotationPage.items || [])) {
              if (annotation.motivation === 'painting') {
                annotation.body.id = this.$apis.record.mediaProxyUrl(annotation.body.id, this.itemId);
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
          const companionWindowId = Object.keys(this.mirador.store.getState().companionWindows)[0];
          let searchId = this.searchService?.id || this.searchService?.['@id'];
          if (!searchId) {
            return;
          }
          searchId = `${searchId}?q=${this.searchQuery}`;

          const actionSearch = window.Mirador.actions.fetchSearch(this.miradorWindowId, companionWindowId, searchId, this.searchQuery);
          this.mirador.store.dispatch(actionSearch);
        }

        const actionShow = (options) => window.Mirador.actions.updateWindow(this.miradorWindowId, options);
        if (!this.isMobileViewport || this.searchQuery) {
          const openSideBarOptions = { allowWindowSideBar: true, sideBarOpen: true };
          this.mirador.store.dispatch(actionShow(openSideBarOptions));
          this.showAnnotations = true;
        } else if (this.isMobileViewport) {
          const allowSideBarOptions = { allowWindowSideBar: true };
          this.mirador.store.dispatch(actionShow(allowSideBarOptions));
        }
      },

      memoiseImageToCanvasMap() {
        if (this.memoisedImageToCanvasMap) {
          return;
        }
        this.versioned('memoiseImageToCanvasMap', arguments);
        this.memoisedImageToCanvasMap = true;
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
        const imageUri = this.urlIsForEuropeanaPresentationAPI(this.uri) ?
          this.$apis.record.mediaProxyUrl(splitImageId[0], this.itemId) :
          splitImageId[0];
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

      findAnnotationFulltextUrls2(annotationJson) {
        return annotationJson.resources
          .filter((resource) => resource.resource && !resource.resource.chars && resource.resource['@id'])
          .map((resource) => resource.resource['@id']);
      },

      findAnnotationFulltextUrls3(annotationJson) {
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

      addFulltextToAnnotations2(annotationJson, fulltext) {
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

      addFulltextToAnnotations3(annotationJson, fulltext) {
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
  @import '@europeana/style/scss/variables';
  @import '@europeana/style/scss/iiif';
</style>