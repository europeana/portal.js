<template>
  <div
    class="iiif-viewer-inner-wrapper h-100 d-flex flex-column overflow-hidden"
  >
    <div
      class="h-100 d-flex flex-row-reverse overflow-auto"
    >
      <MediaImageViewer
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
  import { BTab, BTabs } from 'bootstrap-vue';
  import EuropeanaPresentationManifest from '@/utils/europeana/iiif.js';

  export default {
    name: 'MediaPresentation',

    components: {
      BTab,
      BTabs,
      IIIFAnnotationList: () => import('../iiif/IIIFAnnotationList.vue'),
      MediaImageViewer: () => import('./MediaImageViewer.vue'),
      PaginationNavInput: () => import('../generic/PaginationNavInput.vue')
    },

    props: {
      // TODO: refactor to make this optional, and to also permit supplying
      //       an array of the "canvases" constructed locally from Record API
      //       response web resources
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
