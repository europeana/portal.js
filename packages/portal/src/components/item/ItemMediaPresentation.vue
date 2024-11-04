<template>
  <div>
    <div
      ref="mediaViewerWrapper"
      class="media-viewer-wrapper overflow-hidden"
    >
      <template v-if="!$fetchState.pending">
        <div
          class="media-viewer-inner-wrapper w-100 overflow-auto"
          :class="{
            'pagination-toolbar-padding': addPaginationToolbarPadding,
            'sidebar-toggle-padding': addSidebarTogglePadding
          }"
        >
          <template v-if="sidebarHasContent">
            <ItemMediaSidebar
              v-show="showSidebar"
              ref="sidebar"
              tabindex="0"
              :annotation-list="hasAnnotations"
              :annotation-search="hasSearchService"
              :manifest-uri="uri"
              @keydown.escape.native="showSidebar = false"
            />
            <ItemMediaSidebarToggle
              :show-sidebar="showSidebar"
              class="d-none d-lg-block"
              @toggleSidebar="toggleSidebar"
            />
          </template>
          <MediaImageViewer
            v-if="imageTypeResource"
            :url="resource.about"
            :item-id="itemId"
            :width="resource.ebucoreWidth"
            :height="resource.ebucoreHeight"
            :format="resource.ebucoreHasMimeType"
            :service="resource.svcsHasService"
            :annotation="activeAnnotation"
          >
            <MediaImageViewerControls
              :fullscreen="fullscreen"
              @toggleFullscreen="toggleFullscreen"
            />
          </MediaImageViewer>
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
          class="sidebar-toggle-pagination-toolbar"
          :class="{ closed: !showPages || !multiplePages}"
        >
          <!-- Sidebar toggle for mobile and tablet screens -->
          <ItemMediaSidebarToggle
            v-if="sidebarHasContent"
            :show-sidebar="showSidebar"
            class="d-inline-flex d-lg-none"
            @toggleSidebar="toggleSidebar"
          />
          <span
            v-if="sidebarHasContent && multiplePages"
            class="divider"
          />
          <ItemMediaPaginationToolbar
            v-if="multiplePages"
            :show-pages="showPages"
            :total-results="resourceCount"
            @togglePages="togglePages"
          />
        </div>
        <ItemMediaThumbnails
          v-if="multiplePages"
          v-show="showPages"
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
  import useItemMediaPresentation from '@/composables/itemMediaPresentation.js';

  export default {
    name: 'ItemMediaPresentation',

    components: {
      EmbedOEmbed: () => import('../embed/EmbedOEmbed.vue'),
      ItemMediaPaginationToolbar: () => import('./ItemMediaPaginationToolbar.vue'),
      ItemMediaSidebar: () => import('./ItemMediaSidebar.vue'),
      ItemMediaSidebarToggle: () => import('./ItemMediaSidebarToggle.vue'),
      ItemMediaThumbnails: () => import('./ItemMediaThumbnails.vue'),
      MediaAudioVisualPlayer: () => import('../media/MediaAudioVisualPlayer.vue'),
      MediaImageViewer: () => import('../media/MediaImageViewer.vue'),
      MediaImageViewerControls: () => import('../media/MediaImageViewerControls.vue'),
      MediaPDFViewer: () => import('../media/MediaPDFViewer.vue')
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
        fullscreen: false,
        showPages: true,
        showSidebar: !!this.$route.hash
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

      multiplePages() {
        return this.resourceCount >= 2;
      },

      imageTypeResource() {
        return this.resource?.ebucoreHasMimeType?.startsWith('image/');
      },

      addPaginationToolbarPadding() {
        return !this.imageTypeResource && this.multiplePages;
      },

      addSidebarTogglePadding() {
        return !this.imageTypeResource && this.sidebarHasContent;
      }
    },

    watch: {
      '$route.query.page'() {
        this.setPage(this.$route.query.page);
      },

      '$route.hash'(newVal) {
        this.showSidebar = !!newVal;
      },

      resource: {
        deep: true,
        handler: 'selectResource'
      }
    },

    methods: {
      selectResource() {
        this.$emit('select', this.resource);
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
          this.$refs.mediaViewerWrapper.requestFullscreen();
        }

        this.fullscreen = !this.fullscreen;
      },

      togglePages() {
        this.showPages = !this.showPages;

        if (this.showPages) {
          this.$nextTick(() => {
            this.$refs.itemPages?.$el.focus();
          });
        }
      },

      toggleSidebar() {
        this.showSidebar = !this.showSidebar;

        if (this.showSidebar) {
          this.$nextTick(() => {
            this.$refs.sidebar?.$el.focus();
          });
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';
  @import '@europeana/style/scss/mixins';

  .media-viewer-wrapper {
    position: relative;
    @include swiper-height(0px);

    @media (max-width: ($bp-large - 1px)) {
      max-height: none;
      height: auto
    }

    // prevent feedback button overlapping thumbnails toggle laptop screens
    @media (min-width: $bp-large) and (max-height: 845px) {
      height: calc($swiper-height - 2rem);
    }

    @media (min-width: $bp-xxxl) and (min-height: $bp-extralarge) {
      max-height: 50vh;
      height: 50vh;
    }
  }

  .media-viewer-inner-wrapper {
    background-color: $black;
    @include swiper-height(0px);

    @media (max-width: ($bp-large - 1px)) {
      position: relative;
    }

    @media (min-width: $bp-large) {
      &.pagination-toolbar-padding {
        padding-right: 13rem;
      }

      &.sidebar-toggle-padding {
        padding-left: 1.5rem;
      }
    }

    &.error {
      overflow: auto;
    }
  }

  .sidebar-toggle-pagination-toolbar {
    @media (max-width: ($bp-large - 1px)) {
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: $white;

      &.closed {
        border-bottom: 1px solid $middlegrey;
      }
    }
  }

  .media-viewer-wrapper:fullscreen {
    max-height: 100%;
    .media-viewer-inner-wrapper {
      max-height: 100%;
      height: 100%;
    }
    ::v-deep #item-media-thumbnails,
    ::v-deep .media-viewer-toolbar-pagination {
      display: none !important;
    }
  }

  ::v-deep .divider {
    border: 1px solid $middlegrey;
    height: 1rem;
    box-sizing: content-box;
  }
</style>
