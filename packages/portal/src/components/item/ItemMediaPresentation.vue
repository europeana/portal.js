<template>
  <div>
    <!-- TODO: remove "iiif" from class names as this component is for more than just IIIF -->
    <div
      ref="viewerWrapper"
      class="iiif-viewer-wrapper overflow-hidden"
    >
      <template v-if="!$fetchState.pending">
        <div
          class="iiif-viewer-inner-wrapper w-100 overflow-auto"
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
        <div class="d-flex justify-content-center">
          <!-- Sidebar toggle for mobile and tablet screens -->
          <ItemMediaSidebarToggle
            v-if="sidebarHasContent"
            :show-sidebar="showSidebar"
            class="d-inline-flex d-lg-none"
            @toggleSidebar="toggleSidebar"
          />
          <ItemMediaPaginationToolbar
            v-if="resourceCount >= 2"
            :show-pages="showPages"
            :total-results="resourceCount"
            @togglePages="togglePages"
          />
        </div>
        <ItemMediaThumbnails
          v-if="resourceCount >= 2"
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

      imageTypeResource() {
        return this.resource?.ebucoreHasMimeType?.startsWith('image/');
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
          this.$refs.viewerWrapper.requestFullscreen();
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
  }

  .iiif-viewer-wrapper:fullscreen {
    max-height: 100%;
    .iiif-viewer-inner-wrapper {
      max-height: 100%;
      height: 100%;
    }
    ::v-deep #item-media-thumbnails,
    ::v-deep .iiif-viewer-toolbar-pagination {
      display: none !important;
    }
  }
</style>

<style lang="scss">
  @import '@europeana/style/scss/variables';
  @import '@europeana/style/scss/iiif';
</style>
