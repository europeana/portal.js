<template>
  <div
    data-qa="item media presentation"
  >
    <div
      ref="mediaViewerWrapper"
      class="media-viewer-wrapper overflow-hidden"
      :class="{
        'bg-white': multiplePages,
        'fullscreen-mock': mockFullscreenClass
      }"
      @keydown.escape="exitFullscreen"
    >
      <client-only>
        <div
          class="media-viewer-inner-wrapper w-100"
          :class="{
            'pagination-toolbar-max-width': addPaginationToolbarMaxWidth,
            'sidebar-toggle-max-width': addSidebarToggleMaxWidth,
            'fullscreen-include-sidebar': fullscreen && sidebarHasContent
          }"
        >
          <LoadingSpinner
            v-if="$fetchState.pending"
            class="text-white h-100 d-flex align-items-center justify-content-center"
            size="lg"
          />
          <template v-else>
            <template v-if="sidebarHasContent">
              <ItemMediaSidebar
                ref="sidebar"
                tabindex="0"
                :annotation-list="hasAnnotations"
                :annotation-search="hasAnnotations && hasSearchService"
                :manifest-uri="uri"
                :show="showSidebar"
                @keydown.escape.native="showSidebar = false"
              />
              <ItemMediaSidebarToggle
                :show-sidebar="showSidebar"
                class="d-none d-lg-block"
                @toggleSidebar="toggleSidebar"
              />
            </template>
            <IIIFErrorMessage
              v-if="$fetchState.error || mediaError"
              :provider-url="providerUrl"
            />
            <MediaImageViewer
              v-else-if="viewableImageResource && !displayThumbnail"
              :url="resource.id"
              :item-id="itemId"
              :width="resource.width"
              :height="resource.height"
              :service="resource.service"
              @error="handleImageError"
            >
              <MediaImageViewerControls
                :fullscreen="fullscreen"
                @toggleFullscreen="toggleFullscreen"
              />
            </MediaImageViewer>
            <MediaAudioVisualPlayer
              v-else-if="resource?.edm?.isPlayableMedia"
              :url="resource.id"
              :format="resource.format"
              :item-id="itemId"
              class="media-viewer-content"
            />
            <EmbedGateway
              v-else-if="resource?.edm?.isOEmbed"
              class="media-viewer-content"
              :media="resource?.edm"
              :url="resource.id"
            >
              <EmbedOEmbed
                :url="resource.id"
              />
            </EmbedGateway>
            <template
              v-else-if="displayThumbnail"
            >
              <!-- TODO: mv into own component, e.g. ItemMediaPreview? -->
              <MediaCardImage
                :offset="page - 1"
                data-qa="item media thumbnail"
                :media="resource?.edm"
                :lazy="false"
                :edm-type="edmType"
                :linkable="!itemIsDeleted && !viewableImageResource"
                thumbnail-size="large"
                :europeana-identifier="itemId"
                @click.native="() => thumbnailInteractedWith = true"
              />
              <b-button
                v-if="viewableImageResource"
                data-qa="item media load button"
                class="full-image-button d-inline-flex align-items-center py-2 px-3"
                variant="dark-flat"
                @click="() => thumbnailInteractedWith = true"
              >
                <span class="icon-click mr-2" />
                {{ $t('media.loadFull') }}
              </b-button>
            </template>
          </template>
        </div>
        <div
          v-if="sidebarHasContent || multiplePages"
          class="sidebar-toggle-pagination-toolbar"
          :class="{ closed: !showPages || !multiplePages}"
        >
          <!-- Sidebar toggle for mobile and tablet screens -->
          <ItemMediaSidebarToggle
            v-if="sidebarHasContent"
            button-id="item-media-sidebar-toggle-button-mobile"
            :show-sidebar="showSidebar"
            class="d-inline-flex d-lg-none"
            @toggleSidebar="toggleSidebar"
          />
          <ItemMediaPaginationToolbar
            v-if="multiplePages"
            :show-pages="showPages"
            :total-results="resourceCount"
            :class="fullscreen ? 'd-none' : 'd-inline-flex'"
            @togglePages="togglePages"
          />
        </div>
        <ItemMediaThumbnails
          v-if="multiplePages"
          v-show="showPages && !fullscreen"
          id="item-media-thumbnails"
          ref="itemPages"
          tabindex="0"
          :edm-type="edmType"
          data-qa="item media thumbnails"
          @keydown.escape.native="showPages = false"
        />
      </client-only>
    </div>
  </div>
</template>

<script>
  import LoadingSpinner from '../generic/LoadingSpinner.vue';
  import MediaCardImage from '../media/MediaCardImage.vue';
  import useItemMediaPresentation from '@/composables/itemMediaPresentation.js';

  export class ItemMediaPresentationError extends Error {
    constructor(message) {
      super(message);
      this.name = 'ItemMediaPresentationError';
    }
  }

  export default {
    name: 'ItemMediaPresentation',

    components: {
      EmbedGateway: () => import('../embed/EmbedGateway.vue'),
      EmbedOEmbed: () => import('../embed/EmbedOEmbed.vue'),
      IIIFErrorMessage: () => import('../iiif/IIIFErrorMessage.vue'),
      ItemMediaPaginationToolbar: () => import('./ItemMediaPaginationToolbar.vue'),
      ItemMediaSidebar: () => import('./ItemMediaSidebar.vue'),
      ItemMediaSidebarToggle: () => import('./ItemMediaSidebarToggle.vue'),
      ItemMediaThumbnails: () => import('./ItemMediaThumbnails.vue'),
      LoadingSpinner,
      MediaAudioVisualPlayer: () => import('../media/MediaAudioVisualPlayer.vue'),
      MediaCardImage,
      MediaImageViewer: () => import('../media/MediaImageViewer.vue'),
      MediaImageViewerControls: () => import('../media/MediaImageViewerControls.vue')
    },

    inject: ['itemIsDeleted'],

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
      // skip setup on server-side as fetch is client-side only so presentation
      // will never be populated server-side, to reduce memory footprint
      if (process.server) {
        return;
      }

      const {
        activeAnnotation,
        clear: clearMediaPresentationState,
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
        clearMediaPresentationState,
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
        mediaError: null,
        mockFullscreenClass: false,
        showPages: true,
        showSidebar: false,
        thumbnailInteractedWith: false
      };
    },

    async fetch() {
      this.setPage(this.$route.query.page);

      let error;

      if (this.uri) {
        try {
          await this.fetchPresentation(this.uri);
          await this.$nextTick();
          if (!this.resource) {
            error = new ItemMediaPresentationError('No canvases in IIIF manifest');
          }
        } catch (e) {
          error = e;
        }
      } else if (this.webResources) {
        this.setPresentationFromWebResources(this.webResources);
      } else {
        error = new ItemMediaPresentationError('No manifest URI or web resources for presentation');
      }

      this.selectResource();

      this.showSidebar = (
        (this.hasAnnotations && (window?.innerWidth >= 768)) &&
        (!this.$route.hash || ['#annotations', '#search', '#links'].includes(this.$route.hash))
      ) || ['#annotations', '#search', '#links'].includes(this.$route.hash);

      if (error) {
        this.handleError(error, 'IIIFManifestError');
        throw error;
      }
    },

    fetchOnServer: false,

    computed: {
      displayThumbnail() {
        if (this.hasAnnotations) {
          return false;
        } else if (this.viewableImageResource) {
          return !this.resource.service && (this.resource?.edm?.imageSize === 'extra_large') && !this.thumbnailInteractedWith;
        } else {
          return !(
            this.resource?.edm?.isPlayableMedia || this.resource?.edm?.isOEmbed
          );
        }
      },

      hasManifest() {
        return !!this.uri;
      },

      sidebarHasContent() {
        return this.hasAnnotations || this.hasSearchService || this.hasManifest;
      },

      multiplePages() {
        return this.resourceCount >= 2;
      },

      viewableImageResource() {
        return this.resource?.edm?.isHTMLImage;
      },

      addPaginationToolbarMaxWidth() {
        return !this.viewableImageResource && this.multiplePages;
      },

      addSidebarToggleMaxWidth() {
        return !this.viewableImageResource && this.sidebarHasContent;
      }
    },

    watch: {
      '$route.query.page'() {
        this.mediaError = null;
        this.setPage(this.$route.query.page);
      },

      resource: {
        deep: true,
        handler: 'selectResource'
      }
    },

    destroyed() {
      this.clearMediaPresentationState();
    },

    methods: {
      handleImageError(error) {
        this.mediaError = error;
        this.handleError(error);
      },

      handleError(error) {
        const message = error.message || error.name;
        const url = error.url || this.uri;

        const errorData = {
          item: this.itemId,
          message,
          name: error.name,
          url
        };

        this.$apm?.captureError(errorData);
      },

      selectResource() {
        this.thumbnailInteractedWith = false;
        this.$emit('select', this.resource?.edm);
      },

      toggleFullscreen() {
        if (this.fullscreen) {
          this.exitFullscreen();
        } else {
          this.enterFullscreen();
        }
      },

      exitFullscreen() {
        if (document.fullscreenElement && document.exitFullscreen) {
          document.exitFullscreen();
        }
        if (this.mockFullscreenClass) {
          this.mockFullscreenClass = false;
          document.body.classList.remove('overflow-hidden');
        }

        this.fullscreen = false;
      },

      async enterFullscreen() {
        const isFullScreenSupportedAndEnabled = this.$refs.mediaViewerWrapper.requestFullscreen && document.fullscreenEnabled;
        if (isFullScreenSupportedAndEnabled) {
          this.$refs.mediaViewerWrapper.requestFullscreen();
          document.addEventListener('fullscreenchange', this.handleFullscreenChange);
        } else {
          this.mockFullscreenClass = true;
          document.body.classList.add('overflow-hidden'); // prevent scrolling the body behind the fixed fullscreen media viewer
        }

        this.fullscreen = true;
      },

      // Listen to fullscreenchange event to catch Escape on browser full-screen and reset state
      handleFullscreenChange() {
        // document.fullscreenElement is already reset when this is called, so check the negative condition
        if (!document.fullscreenElement) {
          this.exitFullscreen();
          document.removeEventListener('fullscreenchange', this.handleFullscreenChange);
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
    background-color: $black; // replaced by white when multipages for mobile display transition
    @include media-viewer-height;

    @media (max-width: ($bp-large - 1px)) {
      max-height: none;
      height: auto;
      min-height: $media-viewer-height-medium;
    }
  }

  .media-viewer-inner-wrapper {
    @include media-viewer-height;
    background-color: $black;

    @media (max-width: ($bp-large - 1px)) {
      position: relative;
    }

    &.error {
      overflow: auto;
    }

    &.sidebar-toggle-max-width {
      .media-viewer-content {
        @media (min-width: $bp-large) {
          // Reserve space for sidebar toggle (3.5rem width, doubled to center align) to prevent overlap
          max-width: calc(100% - 7rem);
          margin-left: auto;
          margin-right: auto;
          display: block;
        }
      }
    }

    &.pagination-toolbar-max-width {
      .media-viewer-content {
        // helper SCSS variables and functions to replicate the item page content width (based on b-container and b-col-8 layout)
        // and calculate the space needed to reserve for the pagination toolbar
        $container-lg-max-width: 960px;
        $container-xl-max-width: 1140px;
        $col-8-max-width: 0.8333; // 83.333%;
        $col-padding: 15px;
        $pagination-bar-width: 13rem;
        @function mediaMarginRight($container-width) {
          @return calc(50vw - (($col-8-max-width / 2) * $container-width));
        }
        @function borderWidth($container-width) {
          @return max(0px, $pagination-bar-width - mediaMarginRight($container-width));
        }
        @function maxWidth($container-width) {
          @return calc(($col-8-max-width * $container-width) - (2 * $col-padding));
        }

        @media (min-width: $bp-large) {
          // Align with item page content
          max-width: maxWidth($container-lg-max-width);
          // Add right border when right margins are less than 13rem to prevent pagination and media overlap
          border-right: borderWidth($container-lg-max-width) solid transparent;
          margin-left: auto;
          margin-right: auto;
          display: block;
        }

        @media (min-width: $bp-extralarge) {
          max-width: maxWidth($container-xl-max-width);
          border-right: borderWidth($container-xl-max-width) solid transparent;
        }
      }
    }
  }

  .sidebar-toggle-pagination-toolbar {
    @media (max-width: ($bp-large - 1px)) {
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: $white;
      position: relative;
      height: 3.5rem;

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

      &.fullscreen-include-sidebar {
        @media (max-width: ($bp-large - 1px)) {
          height: calc(100% - 3.5rem);
        }
      }
    }
  }

  // Defining this together with .media-viewer-wrapper:fullscreen does not compile well in older Chrome and iOS browsers
  .media-viewer-wrapper.fullscreen-mock {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    height: 100%;
    max-height: 100%;
    z-index: 1051; // Feedback widget z-index + 1

    .media-viewer-inner-wrapper {
      max-height: 100%;
      height: 100%;

      &.fullscreen-include-sidebar {
        @media (max-width: ($bp-large - 1px)) {
          height: calc(100% - 3.5rem);
        }
      }
    }
  }

  ::v-deep .divider {
    border: 1px solid $middlegrey;
    height: 1rem;
    box-sizing: content-box;
  }

  ::v-deep .responsive-embed-wrapper {
    display: flex;
    align-items: center;

    .html-embed {
      flex-grow: 1;
    }
  }

  .full-image-button {
    background-color: $black;
    border: 1px solid $white;
    position: absolute;
    bottom: 1rem;
    left: 0;
    right: 0;
    margin: 0 auto;
    width: fit-content;
    z-index: 1;

    &:hover {
      color: $white;
    }
  }

  .icon-click {
    font-size: $font-size-large;
    line-height: 1;
  }

  ::v-deep .default-thumbnail {
    height: 290px;
    width: 290px;
  }
</style>
