<template>
  <div>
    <div
      class="iiif-viewer-toolbar-pagination position-absolute d-inline-flex mx-auto"
      :class="{ closed: !showPages }"
    >
      <PaginationNavInput
        :per-page="1"
        :total-results="totalResults"
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
    <ItemMediaThumbnails
      v-show="showPages"
      id="item-media-thumbnails"
      ref="itemPages"
      tabindex="0"
      :edm-type="edmType"
      data-qa="item media thumbnails"
      @keydown.escape.native="showPages = false"
    />
  </div>
</template>

<script>
  import hideTooltips from '@/mixins/hideTooltips';

  export default {
    name: 'ItemMediaPaginationWidget',

    components: {
      ItemMediaThumbnails: () => import('./ItemMediaThumbnails.vue'),
      PaginationNavInput: () => import('../generic/PaginationNavInput.vue')
    },

    mixins: [hideTooltips],

    props: {
      edmType: {
        type: String,
        default: null
      },
      totalResults: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        showPages: true
      };
    },

    methods: {
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

  .pages-toggle {
    background-color: transparent;
    font-size: $font-size-large;

    &.active {
      color: $blue;
    }
  }

  .iiif-viewer-toolbar-pagination {
    background-color: rgba($white, 0.95);
    padding: 0.875rem 1rem;

    @media(max-width: ($bp-large - 1px)) {
      border-top: 1px solid $bodygrey;

      &.closed {
        border-bottom: 1px solid $bodygrey;
      }
    }

    @media (min-width: $bp-large) {
      position: absolute;
      right: 0;
      bottom: 0;
      z-index: 3;
      width: 13rem;
      transition: background-color $standard-transition;

      &.closed {
        background-color: transparent;
        transition: background-color $standard-transition;

        ::v-deep .pagination-nav-input .page-link,
        .pages-toggle {
          &:not(:hover):not(.disabled) {
            color: $white;
          }
        }
      }
    }
  }

  ::v-deep .pagination {
    ul {
      margin-bottom: 0;
    }
  }
</style>
