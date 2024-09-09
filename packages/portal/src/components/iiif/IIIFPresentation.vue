<template>
  <div
    class="iiif-viewer-inner-wrapper h-100 d-flex flex-column overflow-hidden"
  >
    <div
      class="h-100 d-flex flex-row-reverse overflow-auto"
    >
      <CanvasImage
        v-if="content?.format?.startsWith('image/')"
        :url="content.id"
        :width="content.width"
        :height="content.height"
        :format="content.format"
        :service="content.service"
        :class="{ 'w-75': showSidebar, 'w-100': !showSidebar }"
      />
      <code
        v-else
      >
        <pre>{{ content }}</pre>
      </code>
      <transition
        appear
        name="fade"
      >
        <div
          v-if="showSidebar"
          class="w-25 iiif-viewer-sidebar border-bottom"
        >
          <b-tabs>
            <b-tab
              title="Annotations"
              :disabled="!annotationPage"
              :active="!!annotationPage"
            >
              <IIIFAnnotationList
                v-if="!!annotationPage"
                :uri="annotationPage.url.toString()"
                class="iiif-viewer-sidebar-panel"
                @clickAnno="onClickAnno"
              />
            </b-tab>
            <b-tab title="Manifest">
              <a
                :href="uri"
              >
                {{ uri }}
              </a>
            </b-tab>
          </b-tabs>
        </div>
      </transition>
    </div>
    <div
      class="iiif-viewer-toolbar pt-2 px-2 d-flex align-items-center"
    >
      <b-button
        class="d-inline-flex"
        variant="secondary"
        @click="showSidebar = !showSidebar"
      >
        {{ showSidebar ? 'Hide sidebar' : 'Show sidebar' }}
      </b-button>
      <PaginationNavInput
        :per-page="1"
        :total-results="canvasCount"
        class="pagination mx-auto"
      />
    </div>
  </div>
</template>

<script>
  import axios from 'axios';
  import { BTab, BTabs } from 'bootstrap-vue';

  export const isInEuropeanaDomain = (id) => {
    const url = typeof (id) === 'string' ? new URL(id) : id;
    return url.origin.endsWith('.europeana.eu') ||
      url.origin.endsWith('.eanadev.org');
  };

  export const isForEuropeanaPresentationManifest = (id) => {
    const url = typeof (id) === 'string' ? new URL(id) : id;
    return isInEuropeanaDomain(id) && url.pathname.endsWith('/manifest');
  };

  // TODO: mv to a library/pkg
  class EuropeanaPresentationManifest {
    static async fetch(uri) {
      const options = {
        url: uri,
        method: 'get',
        headers: {}
      };
      // NOTE: it would be preferable to do this with all requests, but some providers
      //       CORS support do not permit the Accept header, preventing the manifest
      //       loading
      if (isForEuropeanaPresentationManifest(uri)) {
        options.headers['Accept'] = (
          'application/ld+json;profile="http://iiif.io/api/presentation/3/context.json";q=1.0, application/ld+json;profile="http://iiif.io/api/presentation/2/context.json";q=0.9, application/ld+json;q=0.8, application/json;q=0.7'
        );
      }
      const response = await axios(options);

      const data = EuropeanaPresentationManifest.normalize(response.data);

      const context = [].concat(data?.context || []);
      if (context.includes('http://iiif.io/api/presentation/3/context.json')) {
        return this.parseV3Manifest(data);
      } else if (context.includes('http://iiif.io/api/presentation/2/context.json')) {
        return this.parseV2Manifest(data);
      }

      // TODO: throw version unknown error?
      return data;
    }

    static parseV2Manifest(manifest) {
      return {
        id: manifest.id,
        service: [].concat(manifest.service || []),
        canvases: manifest.sequences.map((sequence) => {
          return sequence.canvases.map((canvas) => {
            return {
              id: canvas.id,
              // TODO: limit to motivation "painting"?
              content: canvas.images.map((image) => image.resource)
            };
          });
        }).flat()
      };
    }

    static parseV3Manifest(manifest) {
      return {
        id: manifest.id,
        service: [].concat(manifest.service || []),
        canvases: manifest.items.map((canvas) => {
          return {
            id: canvas.id,
            content: canvas.items.map((annoPage) => {
              // TODO: limit to motivation "painting"?
              return annoPage.items.map((anno) => anno.body);
            }).flat()
          };
        })
      };
    }

    // removes "@" from start of all keys
    // TODO: rm known prefixes from types, e.g. 'dctypes:', 'sc:', 'oa:'
    // TODO: normalize v2/v3 language maps
    static normalize(thing) {
      if (Array.isArray(thing)) {
        return thing.map(EuropeanaPresentationManifest.normalize);
      } else if (typeof thing === 'object') {
        return Object.keys(thing).reduce((memo, key) => {
          const normKey = key.startsWith('@') ? key.slice(1) : key;
          memo[normKey] = EuropeanaPresentationManifest.normalize(thing[key]);
          return memo;
        }, {});
      } else {
        return thing;
      }
    }
  }

  export default {
    name: 'IIIFPresentation',

    components: {
      BTab,
      BTabs,
      CanvasImage: () => import('../canvas/CanvasImage.vue'),
      IIIFAnnotationList: () => import('./IIIFAnnotationList.vue'),
      PaginationNavInput: () => import('../generic/PaginationNavInput.vue')
    },

    props: {
      // TODO: refactor to make this optional, and to also permit supplying
      //       an array of the canvases constructed from the Record API response
      //       web resources
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
        annotationPage: null,
        manifest: null,
        page: 1,
        showSidebar: null,
        thumbnail: null
      };
    },

    async fetch() {
      this.setPage();
      this.manifest = await EuropeanaPresentationManifest.fetch(this.uri);
    },

    computed: {
      canvasCount() {
        return this.manifest?.canvases?.length || 0;
      },

      // first content resource of the current canvas/page
      content() {
        return this.manifest?.canvases[this.page - 1]?.content?.[0];
      }
    },

    watch: {
      '$route.query.page': 'setPage'
    },

    methods: {
      onClickAnno(anno) {
        console.log('onClickAnno', anno);
        // const layer = this.map.getLayers()[0];
      },

      setPage() {
        this.page = Number(this.$route.query.page) || 1;
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';
  @import '@europeana/style/scss/iiif';
  @import '@europeana/style/scss/transitions';

  .iiif-viewer-inner-wrapper {
    background-color: $black;

    &.error {
      overflow: auto;
    }

    .iiif-viewer-sidebar {
      background-color: $white;
      overflow: auto;

      .tab-pane {
        overflow-wrap: break-word;
        padding: 1rem;
      }
    }

    .iiif-viewer-toolbar {
      background-color: $white;
    }
  }

  ::v-deep .pagination {
    ul {
      margin-bottom: 0;
    }
  }
</style>
