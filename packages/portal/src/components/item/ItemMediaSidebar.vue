<template>
  <transition
    name="fade"
  >
    <div
      v-show="show"
      class="media-viewer-sidebar"
      data-qa="item media sidebar"
    >
      <b-tabs
        :id="sidebarId"
        v-model="activeTabIndex"
        vertical
      >
        <!-- Place tooltip outside tab to prevent being lazy loaded -->
        <b-tooltip
          v-if="annotationList"
          target="item-media-sidebar-annotations"
          :title="$t('media.sidebar.annotations')"
          boundary=".media-viewer-sidebar"
          placement="right"
          custom-class="ml-0"
        />
        <b-tab
          v-if="annotationList"
          data-qa="item media sidebar annotations"
          button-id="item-media-sidebar-annotations"
          :title-link-attributes="{ 'aria-label': $t('media.sidebar.annotations'), href: '#annotations' }"
        >
          <template #title>
            <!-- Listen to mouseleave on span, on b-tab does not work -->
            <span
              class="icon icon-annotations"
              @mouseleave="hideTooltips"
            />
          </template>
          <h2
            class="px-3"
            data-qa="item media sidebar annotations title"
          >
            {{ $tc('media.sidebar.annotationsCount', $n(annotationsCount)) }}
          </h2>
          <MediaAnnotationList
            v-if="activeTabHistory.includes('#annotations')"
            :active="activeTabHash === '#annotations'"
            class="media-viewer-sidebar-panel"
            @fetched="handleAnnotationsFetched"
          />
        </b-tab>
        <b-tooltip
          v-if="annotationSearch"
          target="item-media-sidebar-search"
          :title="$t('media.sidebar.search')"
          boundary=".media-viewer-sidebar"
          placement="right"
          custom-class="ml-0"
        />
        <b-tab
          v-if="annotationSearch"
          data-qa="item media sidebar search"
          button-id="item-media-sidebar-search"
          :title-link-attributes="{ 'aria-label': $t('media.sidebar.search'), href: '#search' }"
        >
          <template #title>
            <span
              class="icon icon-search-in-text"
              @mouseleave="hideTooltips"
            />
          </template>
          <h2
            id="item-media-sidebar-search-title"
            class="px-3"
          >
            {{ $t('media.sidebar.search') }}
          </h2>
          <MediaAnnotationSearch
            v-if="activeTabHistory.includes('#search')"
            :active="activeTabHash === '#search'"
            class="media-viewer-sidebar-panel"
          />
        </b-tab>
        <b-tooltip
          v-if="!!manifestUri"
          target="item-media-sidebar-links"
          :title="$t('media.sidebar.links')"
          boundary=".media-viewer-sidebar"
          placement="right"
          custom-class="ml-0"
        />
        <b-tab
          v-if="!!manifestUri"
          data-qa="item media sidebar links"
          button-id="item-media-sidebar-links"
          lazy
          :title-link-attributes="{ 'aria-label': $t('media.sidebar.links'), href: '#links' }"
        >
          <template #title>
            <span
              class="icon icon-link"
              @mouseleave="hideTooltips"
            />
          </template>
          <h2 class="px-3">
            {{ $t('media.sidebar.links') }}
          </h2>
          <h3 class="px-3">
            {{ $t('media.sidebar.IIIFManifest') }}
          </h3>
          <b-link
            :href="manifestUri"
            target="_blank"
            class="manifest-link d-inline-block px-3"
          >
            {{ manifestUri }}
          </b-link>
        </b-tab>
      </b-tabs>
    </div>
  </transition>
</template>

<script>
  import { BTab, BTabs } from 'bootstrap-vue';

  import useActiveTab from '@/composables/activeTab.js';
  import useHideTooltips from '@/composables/hideTooltips.js';

  export default {
    name: 'ItemMediaSidebar',

    components: {
      BTab,
      BTabs,
      MediaAnnotationList: () => import('../media/MediaAnnotationList.vue'),
      MediaAnnotationSearch: () => import('../media/MediaAnnotationSearch.vue')
    },

    provide() {
      return {
        annotationScrollToContainerSelector: `#${this.sidebarId}__BV_tab_container_`
      };
    },

    props: {
      annotationList: {
        type: Boolean,
        default: false
      },
      annotationSearch: {
        type: Boolean,
        default: false
      },
      manifestUri: {
        type: String,
        default: null
      },
      query: {
        type: String,
        default: null
      },
      show: {
        type: Boolean,
        default: true
      }
    },

    setup(props) {
      const tabHashes = [];
      if (props.annotationList) {
        tabHashes.push('#annotations');
      }
      if (props.annotationSearch) {
        tabHashes.push('#search');
      }
      if (props.manifestUri) {
        tabHashes.push('#links');
      }

      const { activeTabHash, activeTabHistory, activeTabIndex, watchTabIndex, unwatchTabIndex } = useActiveTab(tabHashes);
      const { hideTooltips } = useHideTooltips();
      return { activeTabHash, activeTabHistory, activeTabIndex, hideTooltips, watchTabIndex, unwatchTabIndex };
    },

    data() {
      return {
        sidebarId: 'item-media-sidebar',
        annotationsCount: null
      };
    },

    watch: {
      show(val) {
        if (val) {
          this.watchTabIndex();
        } else {
          this.unwatchTabIndex();
          this.$router.replace({ ...this.$route, hash: undefined });
        }
      }
    },

    mounted() {
      if (this.show) {
        this.watchTabIndex();
      }
    },

    methods: {
      handleAnnotationsFetched(annotationsLength) {
        this.annotationsCount = annotationsLength;
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';
  @import '@europeana/style/scss/transitions';

  .media-viewer-sidebar {
    width: 300px;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    z-index: 2;
    background-color: $white;

    @media (min-width: $bp-large) {
      bottom: 3.25rem;
    }

    .tabs {
      background-color: $white;
    }

    .tab-pane {
      overflow-wrap: break-word;
    }

    ::v-deep .tab-content {
      padding: 1rem 0;
      overflow: auto;

      h2 {
        font-size: 1.125rem;
      }

      h3 {
        font-size: $font-size-base;
        margin-bottom: 0.5rem;
      }

      .manifest-link {
        overflow-wrap: anywhere;
        color: $blue;
        font-size: $font-size-small;
      }
    }

    .icon {
      font-size: $font-size-large;
    }
  }
</style>
