<template>
  <div>
    <div
      class="iiif-viewer-wrapper d-flex flex-column flex-lg-row"
    >
      <div
        class="iiif-viewer-inner-wrapper h-100 w-100 d-flex flex-column overflow-hidden"
      >
        <div
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
            :annotation-page="annotationPage"
            :uri="uri"
          />
        </div>
        <div
          class="iiif-viewer-toolbar d-flex align-items-center"
        >
          <b-button
            v-if="sidebarHasContent"
            v-b-tooltip.bottom
            :title="showSidebar ? $t('media.sidebar.hide') : $t('media.sidebar.show')"
            :aria-label="showSidebar ? $t('media.sidebar.hide') : $t('media.sidebar.show')"
            variant="light-flat"
            class="sidebar-toggle button-icon-only"
            @click="showSidebar = !showSidebar"
          >
            <span class="icon icon-kebab" />
          </b-button>
          <PaginationNavInput
            :per-page="1"
            :total-results="resourceCount"
            class="pagination mx-auto"
          />
          <span
            class="icon-pages mr-1 show-thumbnails-toggle"
            :class="showThumbnails ? 'active' : ''"
            data-qa="show thumbnails button icon"
            @click="showThumbnails = !showThumbnails"
          />
        </div>
      </div>
      <ItemMediaThumbnails
        v-if="showThumbnails"
        :resources="thumbnailResources"
        :selected-index="page -1"
        :edm-type="edmType"
      />
    </div>
  </div>
</template>

<script>
  import EuropeanaMediaPresentation from '@/utils/europeana/iiif.js';

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
        annotationPage: null,
        presentation: null,
        page: 1,
        showSidebar: null,
        showThumbnails: true,
        sidebarHasContent: !!this.annotationPage || !!this.uri
      };
    },

    async fetch() {
      if (this.uri) {
        this.presentation = await (new EuropeanaMediaPresentation(this.uri)).fetch();
      } else if (this.webResources) {
        this.presentation = {
          resources: this.webResources
        };
      } else {
        // TODO: what to do!?
      }

      this.setPage();
    },

    computed: {
      resource() {
        return this.presentation?.resources[this.page - 1];
      },

      resourceCount() {
        return this.presentation?.resources?.length || 0;
      },

      thumbnailResources() {
        return this.presentation?.resources || [];
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
        this.$nextTick(() => {
          this.$emit('select', this.resource?.about);
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
  .show-thumbnails-toggle {
    font-size: 1.5rem;
    &.active {
      color: $blue;
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
