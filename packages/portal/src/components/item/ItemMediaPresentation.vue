<template>
  <div>
    <!-- TODO: remove "iiif" from class names as this component is for more than just IIIF -->
    <div
      class="iiif-viewer-wrapper overflow-hidden"
    >
      <template v-if="!$fetchState.pending">
        <div
          class="iiif-viewer-inner-wrapper w-100 overflow-auto"
        >
          <ItemMediaSidebar
            v-if="sidebarHasContent"
            v-show="showSidebar"
            id="item-media-sidebar"
            ref="sidebar"
            tabindex="0"
            :annotation-list="hasAnnotations"
            :manifest-uri="uri"
            @selectAnno="onSelectAnno"
            @keydown.escape.native="showSidebar = false"
          />
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
          <EmbedOEmbed
            v-else-if="resource?.isOEmbed"
            :url="resource.about"
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
        </div>
        <div
          class="iiif-viewer-toolbar d-flex flex-wrap flex-lg-nowrap align-items-center"
        >
          <!-- TODO: Refactor into separate ItemMediaToolbar component -->
          <b-button
            v-if="sidebarHasContent"
            v-b-tooltip.top="showSidebar ? $t('media.sidebar.hide') : $t('media.sidebar.show')"
            :aria-label="showSidebar ? $t('media.sidebar.hide') : $t('media.sidebar.show')"
            variant="light-flat"
            class="sidebar-toggle button-icon-only"
            :class="{ 'active': showSidebar }"
            data-qa="iiif viewer toolbar sidebar toggle"
            aria-controls="item-media-sidebar"
            :aria-expanded="showSidebar ? 'true' : 'false'"
            @click="toggleSidebar"
            @mouseleave="hideTooltips"
          >
            <span class="icon icon-kebab" />
          </b-button>
          <div
            v-if="resourceCount >= 2"
            class="iiif-viewer-toolbar-pagination d-flex w-100 w-lg-auto"
            :class="{ closed: !showPages }"
          >
            <PaginationNavInput
              :per-page="1"
              :total-results="resourceCount"
              :button-text="false"
              :page-input="false"
              :button-icon-class="'icon-arrow-outline'"
              :progress="true"
              class="pagination ml-auto"
            />
            <b-button
              v-b-tooltip.top="showPages ? $t('media.pages.hide') : $t('media.pages.show')"
              :aria-label="showPages ? $t('media.pages.hide') : $t('media.pages.show')"
              variant="light-flat"
              class="pages-toggle button-icon-only ml-3 mr-auto mr-lg-0"
              :class="{ 'active': showPages }"
              data-qa="iiif viewer toolbar pages toggle"
              aria-controls="item-media-thumbnails"
              :aria-expanded="showPages ? 'true' : 'false'"
              @click="togglePages"
              @mouseleave="hideTooltips"
            >
              <span class="icon icon-pages" />
            </b-button>
          </div>
        </div>
        <ItemMediaThumbnails
          v-if="resourceCount >= 2 && showPages"
          id="item-media-thumbnails"
          ref="itemPages"
          tabindex="0"
          :edm-type="edmType"
          data-qa="item media thumbnails"
          @keydown.escape.native="showPages = false"
        />
      </template>
    </div>
  </div>
</template>

<script>
  import hideTooltips from '@/mixins/hideTooltips';
  import useItemMediaPresentation from '@/composables/itemMediaPresentation.js';

  export default {
    name: 'ItemMediaPresentation',

    components: {
      EmbedOEmbed: () => import('../embed/EmbedOEmbed.vue'),
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

    setup() {
      const {
        fetchPresentation,
        hasAnnotations,
        page,
        resource,
        resourceCount,
        setPage,
        setPresentationFromWebResources
      } = useItemMediaPresentation();
      return { fetchPresentation, hasAnnotations, page, resource, resourceCount, setPage, setPresentationFromWebResources };
    },

    data() {
      return {
        activeAnnotation: null,
        showSidebar: false,
        showPages: true
      };
    },

    async fetch() {
      this.setPage(this.$route.query.page);

      if (this.uri) {
        await this.fetchPresentation(this.uri);
      } else if (this.webResources) {
        this.setPresentationFromWebResources(this.webResources);
      } else {
        throw new Error('No manifest URI or web resources for presentation');
      }

      this.selectResource();
    },

    computed: {
      hasManifest() {
        return !!this.uri;
      },

      sidebarHasContent() {
        return this.hasAnnotations || this.hasManifest;
      }
    },

    watch: {
      '$route.query.page'() {
        this.setPage(this.$route.query.page);
      },

      resource: {
        deep: true,
        handler: 'selectResource'
      }
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

      selectResource() {
        this.activeAnnotation = null;
        this.$emit('select', this.resource);
      },

      toggleSidebar() {
        this.showSidebar = !this.showSidebar;

        if (this.showSidebar) {
          this.$nextTick(() => {
            this.$refs.sidebar?.$el.focus();
          });
        }
      },

      togglePages() {
        this.showPages = !this.showPages;

        if (this.showPages) {
          this.$nextTick(() => {
            this.$refs.itemPages?.$el.focus();
          });
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';
  @import '@europeana/style/scss/iiif';

  .iiif-viewer-wrapper {
    position: relative;
    background-color: $black;
    @include swiper-height(0px);

    @media (max-width: ($bp-large - 1px)) {
      max-height: none;
      height: auto
    }

    // prevent feedback button overlapping thumbnails toggle laptop screens
    @media (min-width: $bp-large) and (max-height: 845px) {
      height: calc($swiper-height - 2rem);
    }
  }

  .iiif-viewer-inner-wrapper {
    @include swiper-height(0px);

    @media (max-width: ($bp-large - 1px)) {
      position: relative;
    }

    &.error {
      overflow: auto;
    }
  }

  .iiif-viewer-toolbar {
    background-color: rgba($white, 0.95);
    margin-top: -3.25rem;
    position: relative;
    z-index: 2;

    @media (min-width: $bp-large) {
      margin-top: 0;
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
    }

    .sidebar-toggle {
      margin: 0.875rem 1rem;
    }

    .sidebar-toggle,
    .pages-toggle {
      background-color: transparent;
      font-size: $font-size-large;

      &.active {
        color: $blue;
      }
    }
  }

  .iiif-viewer-toolbar-pagination {
    padding: 0.875rem 1rem;

    @media(max-width: ($bp-large - 1px)) {
      border-top: 1px solid $bodygrey;

      &.closed {
        border-bottom: 1px solid $bodygrey;
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
