<template>
  <div>
    <!-- TODO: remove "iiif" from class names as this component is for more than just IIIF -->
    <div
      class="iiif-viewer-wrapper d-flex flex-column"
    >
      <div
        class="iiif-viewer-inner-wrapper h-100 d-flex flex-column overflow-hidden"
      >
        <div
          v-if="!$fetchState.pending"
          class="h-100 d-flex flex-row-reverse overflow-auto"
        >
          <MediaImageViewer
            v-if="resource?.ebucoreHasMimeType?.startsWith('image/')"
            :url="resource.about"
            :item-id="itemId"
            :width="resource.ebucoreWidth"
            :height="resource.ebucoreHeight"
            :format="resource.ebucoreHasMimeType"
            :service="resource.svcsHasService"
            :annotation="activeAnnotation"
          />
          <MediaPDFViewer
            v-else-if="resource?.ebucoreHasMimeType === 'application/pdf'"
            :url="resource.about"
            :item-id="itemId"
          />
          <MediaAudioVisualPlayer
            v-else-if="resource?.isPlayableMedia"
            :url="resource.about"
            :format="resource.ebucoreHasMimeType"
            :item-id="itemId"
          />
          <code
            v-else
            class="h-50 w-100 p-5"
          >
            <pre
              :style="{ color: 'white' }"
            ><!--
            -->{{ JSON.stringify(resource, null, 2) }}
            </pre>
          </code>
          <ItemMediaSidebar
            v-if="showSidebar"
            :annotation-uri="annotationUri"
            :annotation-target-id="annotationTargetId"
            :annotation-text-granularity="annotationTextGranularity"
            :manifest-uri="uri"
            @selectAnno="onSelectAnno"
          />
        </div>
        <div
          class="iiif-viewer-toolbar d-flex align-items-center"
        >
          <b-button
            v-if="sidebarHasContent"
            v-b-tooltip.top="showSidebar ? $t('media.sidebar.hide') : $t('media.sidebar.show')"
            :aria-label="showSidebar ? $t('media.sidebar.hide') : $t('media.sidebar.show')"
            variant="light-flat"
            class="sidebar-toggle button-icon-only"
            data-qa="iiif viewer toolbar sidebar toggle"
            @click="showSidebar = !showSidebar"
            @mouseleave="hideTooltips"
          >
            <span class="icon icon-kebab" />
          </b-button>
          <PaginationNavInput
            :per-page="1"
            :total-results="resourceCount"
            :button-text="false"
            :page-input="false"
            :button-icon-class="'icon-arrow-outline'"
            :progress="true"
            class="pagination ml-auto"
          />
        </div>
      </div>
    </div>
    <ItemMediaThumbnails
      v-if="thumbnails.length > 0"
      :thumbnails="thumbnails"
      @clickThumbnail="handleClickThumbnail"
    />
  </div>
</template>

<script>
  import EuropeanaMediaPresentation from '@/utils/europeana/media/Presentation.js';
  import hideTooltips from '@/mixins/hideTooltips';

  export default {
    name: 'ItemMediaPresentation',

    components: {
      ItemMediaSidebar: () => import('./ItemMediaSidebar.vue'),
      ItemMediaThumbnails: () => import('./ItemMediaThumbnails.vue'),
      MediaAudioVisualPlayer: () => import('../media/MediaAudioVisualPlayer.vue'),
      MediaImageViewer: () => import('../media/MediaImageViewer.vue'),
      MediaPDFViewer: () => import('../media/MediaPDFViewer.vue'),
      PaginationNavInput: () => import('../generic/PaginationNavInput.vue')
    },

    mixins: [hideTooltips],

    props: {
      uri: {
        type: String,
        default: null
      },

      webResources: {
        type: Array,
        default: null
      },

      itemId: {
        type: String,
        default: null
      },

      edmType: {
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
        activeAnnotation: null,
        presentation: null,
        page: 1,
        showSidebar: null
      };
    },

    async fetch() {
      let presentation;

      if (this.uri) {
        presentation = await EuropeanaMediaPresentation.from(this.uri);
      } else if (this.webResources) {
        presentation = new EuropeanaMediaPresentation({
          canvases: this.webResources.map((resource) => ({
            resource
          }))
        });
      } else {
        throw new Error('No manifest URI or web resources for presentation');
      }

      this.presentation = Object.freeze(presentation);

      this.setPage();
    },

    computed: {
      /**
       * Annotation page/list: either a URI as a string, or an object with id
       * property being the URI
       */
      annotationCollection() {
        return this.canvas?.annotations?.[0];
      },

      annotationTargetId() {
        // account for Europeana fulltext annotations incorrectly targeting IIIF
        // images instead of canvases
        return this.presentation.isInEuropeanaDomain ? this.resource.about : this.canvas.id;
      },

      annotationUri() {
        if (!this.annotationCollection) {
          return null;
        } else if (typeof this.annotationCollection === 'string') {
          return this.annotationCollection;
        }
        return this.annotationCollection.id;
      },

      annotationTextGranularity() {
        return this.annotationCollection?.textGranularity;
      },

      canvas() {
        return this.presentation?.canvases?.[this.page - 1];
      },

      resource() {
        return this.canvas?.resource;
      },

      resources() {
        return this.presentation?.canvases?.map((canvas) => canvas.resource).filter(Boolean);
      },

      resourceCount() {
        return this.resources?.length || 0;
      },

      sidebarHasContent() {
        return !!this.annotationUri || !!this.uri;
      },

      thumbnail() {
        return this.thumbnails?.[this.page - 1];
      },

      thumbnails() {
        return this.resources?.map((resource) => resource.thumbnails?.(this.$nuxt.context)?.small) || [];
      }
    },

    watch: {
      '$route.query.page': 'setPage'
    },

    methods: {
      handleClickThumbnail(index) {
        const page = index + 1;
        this.$router.push({ ...this.$route, query: { ...this.$route.query, page } });
      },

      onSelectAnno(anno) {
        this.activeAnnotation = anno;
        // store the annotation id in the route hash, to pre-highlight it on page reload
        // this.$router.push({ ...this.$route, hash: `#anno=${anno.id}` });
      },

      setPage() {
        this.page = Number(this.$route.query.page) || 1;
        this.activeAnnotation = null;
        this.$nextTick(() => {
          this.$emit('select', this.resource);
        });
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';
  @import '@europeana/style/scss/iiif';

  .iiif-viewer-inner-wrapper {
    background-color: $black;
    position: relative;

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
      background-color: rgba($white, 0.95);
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 0.875rem 1rem;

      .sidebar-toggle {
        background-color: transparent;
        font-size: $font-size-large;
      }
    }
  }

  ::v-deep .pagination {
    ul {
      margin-bottom: 0;
    }
  }
</style>

<style lang="scss">
  @import '@europeana/style/scss/variables';
  @import '@europeana/style/scss/iiif';
</style>
