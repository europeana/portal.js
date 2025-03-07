<template>
  <div
    class="sidebar-toolbar"
    :class="{ 'closed': !showSidebar }"
  >
    <b-button
      v-b-tooltip.top="showSidebar ? $t('media.sidebar.hide') : $t('media.sidebar.show')"
      :aria-label="showSidebar ? $t('media.sidebar.hide') : $t('media.sidebar.show')"
      variant="light-flat"
      class="sidebar-toggle button-icon-only"
      data-qa="media viewer toolbar sidebar toggle"
      aria-controls="item-media-sidebar"
      :aria-expanded="showSidebar ? 'true' : 'false'"
      @click="$emit('toggleSidebar')"
      @mouseleave="hideTooltips"
    >
      <span
        class="icon"
        :class="showSidebar ? 'icon-clear' : 'icon-kebab'"
      />
    </b-button>
  </div>
</template>

<script>
  import useHideTooltips from '@/composables/hideTooltips.js';

  export default {
    name: 'ItemMediaSidebarWidget',

    props: {
      showSidebar: {
        type: Boolean,
        default: false
      }
    },

    setup() {
      const { hideTooltips } = useHideTooltips();
      return { hideTooltips };
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';

  .sidebar-toolbar {
    background-color: rgba($white, 0.95);
    position: absolute;
    left: 0;
    bottom: 0;
    z-index: 3;

    @media (min-width: $bp-large) {
      background-color: $white;
      width: 315px;
      transition: background-color $standard-transition;

      &.closed {
        background-color: transparent;
        transition: background-color $standard-transition;
      }
    }
  }

  .sidebar-toggle {
    margin: 0.875rem 1rem;
    background-color: transparent;
    font-size: $font-size-large;

    .icon-clear {
      font-size: $font-size-small;
    }

    @media (min-width: $bp-large) {
      @at-root .closed & {
        &:not(:hover) {
          color: $white;
        }
      }
    }
  }
</style>
