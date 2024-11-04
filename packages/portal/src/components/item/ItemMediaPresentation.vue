<template>
  <div>
    <!-- TODO: remove "iiif" from class names as this component is for more than just IIIF -->
    <div
      ref="viewerWrapper"
      class="iiif-viewer-wrapper overflow-hidden"
    >
      <IIIFErrorMessage
        v-if="$fetchState.error"
        :provider-url="providerUrl"
      />
      <b-container
        v-else-if="$fetchState.pending"
        data-qa="loading spinner container"
      >
        <b-row class="flex-md-row py-4 text-center">
          <b-col cols="12">
            <LoadingSpinner :style="{ background: 'white' }" />
          </b-col>
        </b-row>
      </b-container>
      <template v-else>
        <div
          class="iiif-viewer-inner-wrapper w-100 overflow-auto"
        >
          <ItemMediaSidebar
            v-if="sidebarHasContent"
            v-show="showSidebar"
            ref="sidebar"
            tabindex="0"
            :annotation-list="hasAnnotations"
            :annotation-search="hasSearchService"
            :manifest-uri="uri"
            @keydown.escape.native="showSidebar = false"
          />
          <MediaImageViewer
            v-if="imageTypeResource"
            :url="resource.id"
            :item-id="itemId"
            :width="resource.width"
            :height="resource.height"
            :format="resource.format"
            :service="resource.service"
            :annotation="activeAnnotation"
            @error="handleMediaRendererError"
          />
          <MediaPDFViewer
            v-else-if="resource?.format === 'application/pdf'"
            :url="resource.id"
            :item-id="itemId"
          />
          <MediaAudioVisualPlayer
            v-else-if="resource?.edm.isPlayableMedia"
            :url="resource.id"
            :format="resource.format"
            :item-id="itemId"
          />
          <EmbedOEmbed
            v-else-if="resource?.edm.isOEmbed"
            :url="resource.id"
          />
          <code
            v-else
            class="h-50 w-100 p-5"
          >
            <pre
              :style="{ color: 'white', 'overflow-wrap': 'break-word' }"
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
          <MediaImageViewerControls
            v-if="imageTypeResource"
            :fullscreen="fullscreen"
            @toggleFullscreen="toggleFullscreen"
          />
          <div
            v-if="resourceCount >= 2"
            class="iiif-viewer-toolbar-pagination d-flex mx-auto"
            :class="{
              closed: !showPages,
              'mx-sm-0': imageTypeResource,
              'mr-lg-0': !imageTypeResource
            }"
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
  import LoadingSpinner from '../generic/LoadingSpinner.vue';
  import useItemMediaPresentation from '@/composables/itemMediaPresentation.js';
  import hideTooltips from '@/mixins/hideTooltips';

  export default {
    name: 'ItemMediaPresentation',

    components: {
      EmbedOEmbed: () => import('../embed/EmbedOEmbed.vue'),
      IIIFErrorMessage: () => import('../iiif/IIIFErrorMessage.vue'),
      ItemMediaSidebar: () => import('./ItemMediaSidebar.vue'),
      ItemMediaThumbnails: () => import('./ItemMediaThumbnails.vue'),
      LoadingSpinner,
      MediaAudioVisualPlayer: () => import('../media/MediaAudioVisualPlayer.vue'),
      MediaImageViewer: () => import('../media/MediaImageViewer.vue'),
      MediaImageViewerControls: () => import('../media/MediaImageViewerControls.vue'),
      MediaPDFViewer: () => import('../media/MediaPDFViewer.vue'),
      PaginationNavInput: () => import('../generic/PaginationNavInput.vue')
    },

    mixins: [hideTooltips],

    provide() {
      return {
        annotationScrollToContainerSelector: `#${this.sidebarId}__BV_tab_container_`
      };
    },

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

      providerUrl: {
        type: String,
        default: null
      }
    },

    setup() {
      const {
        activeAnnotation,
        fetchPresentation,
        hasAnnotations,
        hasSearchService,
        page,
        resource,
        resourceCount,
        setPage,
        setPresentationFromWebResources
      } = useItemMediaPresentation();

      return {
        activeAnnotation,
        fetchPresentation,
        hasAnnotations,
        hasSearchService,
        page,
        resource,
        resourceCount,
        setPage,
        setPresentationFromWebResources
      };
    },

    data() {
      return {
        showSidebar: !!this.$route.hash,
        showPages: true,
        sidebarId: 'item-media-sidebar',
        fullscreen: false
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
        return this.hasAnnotations || this.hasSearchService || this.hasManifest;
      },

      imageTypeResource() {
        return this.resource?.format?.startsWith('image/');
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

      handleMediaRendererError(error) {
        if (error.isAxiosError) {
          this.$fetchState.error = error;
        } else {
          // else what?
        }
      },

      selectResource() {
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
      },

      toggleFullscreen() {
        // Check for fullscreen support first?
        if (this.fullscreen) {
          if (document.exitFullscreen) {
            document.exitFullscreen();
          } else if (document['webKitExitFullscreen']) {
            document['webKitExitFullscreen']();
          }
        } else {
          this.$refs.viewerWrapper.requestFullscreen();
        }

        this.fullscreen = !this.fullscreen;
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

    .sidebar-toggle, .viewer-controls {
      margin: 0.875rem 1rem;
    }

    ::v-deep button {
      background-color: transparent;
      font-size: $font-size-large;

      &.active {
        color: $blue;
      }
    }
  }

  .iiif-viewer-toolbar-pagination {
    padding: 0.875rem 1rem;
    width: 100% !important;

    @media(min-width: ($bp-small)) {
      width: auto !important;
    }

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

  .iiif-viewer-wrapper:fullscreen {
    max-height: 100%;
    .iiif-viewer-inner-wrapper {
      max-height: 100%;
      height: 100%;
    }
    #item-media-thumbnails, .iiif-viewer-toolbar-pagination {
      display: none !important;
    }
  }
</style>

<style lang="scss">
  @import '@europeana/style/scss/variables';
  @import '@europeana/style/scss/iiif';
</style>
