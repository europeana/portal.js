<template>
  <div
    class="media-viewer-toolbar-pagination d-inline-flex align-items-center"
    :class="{ closed: !showPages }"
  >
    <PaginationNavInput
      :per-page="1"
      :total-results="totalResults"
      :button-text="false"
      :page-input="false"
      :button-icon-class="'icon-arrow-outline'"
      :progress="true"
      :exclude-params="['anno']"
      class="pagination ml-auto"
    />
    <span class="divider" />
    <b-button
      v-b-tooltip.top="showPages ? $t('media.pages.hide') : $t('media.pages.show')"
      :aria-label="showPages ? $t('media.pages.hide') : $t('media.pages.show')"
      variant="light-flat"
      class="pages-toggle button-icon-only ml-3 mr-auto mr-lg-0"
      data-qa="media viewer toolbar pages toggle"
      aria-controls="item-media-thumbnails"
      :aria-expanded="showPages ? 'true' : 'false'"
      @click="$emit('togglePages')"
      @mouseleave="hideTooltips"
    >
      <span
        class="icon"
        :class="showPages ? 'icon-clear' : 'icon-pages'"
      />
    </b-button>
  </div>
</template>

<script>
  import hideTooltips from '@/mixins/hideTooltips';
  import PaginationNavInput from '@/components/generic/PaginationNavInput';

  export default {
    name: 'ItemMediaPaginationToolbar',

    components: {
      PaginationNavInput
    },

    mixins: [hideTooltips],

    props: {
      showPages: {
        type: Boolean,
        default: false
      },
      totalResults: {
        type: Number,
        default: 0
      }
    }
  };
  </script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';

  .pages-toggle {
    background-color: transparent;
    font-size: $font-size-large;

    .icon-clear {
      font-size: $font-size-small;
    }
  }

  .media-viewer-toolbar-pagination {
    background-color: rgba($white, 0.95);
    padding: 0.875rem 1rem;

    @media (min-width: $bp-large) {
      background-color: $white;
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

        .divider {
          border-color: $mediumgrey-light;
        }
      }
    }
  }

  .pagination {
    margin-right: 0.75rem;

    ::v-deep ul {
      margin-bottom: 0;
    }
  }
</style>
