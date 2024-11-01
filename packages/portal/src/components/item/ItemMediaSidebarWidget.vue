<template>
  <div>
    <ItemMediaSidebar
      v-show="showSidebar"
      ref="sidebar"
      tabindex="0"
      :annotation-list="hasAnnotations"
      :annotation-search="hasSearchService"
      :manifest-uri="uri"
      @keydown.escape.native="showSidebar = false"
    />
    <div
      class="sidebar-toolbar"
      :class="{ 'closed': !showSidebar }"
    >
      <b-button
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
    </div>
  </div>
</template>

<script>
  import hideTooltips from '@/mixins/hideTooltips';
  import useItemMediaPresentation from '@/composables/itemMediaPresentation.js';

  export default {
    name: 'ItemMediaSidebarWidget',

    components: {
      ItemMediaSidebar: () => import('./ItemMediaSidebar.vue')
    },

    mixins: [hideTooltips],

    props: {
      uri: {
        type: String,
        default: null
      }
    },

    setup() {
      const { hasAnnotations, hasSearchService } = useItemMediaPresentation();

      return { hasAnnotations, hasSearchService };
    },

    data() {
      return {
        showSidebar: !!this.$route.hash
      };
    },

    // TODO: Watch $route.hash change?

    methods: {
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

  .sidebar-toolbar {
    background-color: rgba($white, 0.95);

    @media (min-width: $bp-large) {
      position: absolute;
      left: 0;
      bottom: 0;
      z-index: 3;
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

    &.active {
      color: $blue;
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
