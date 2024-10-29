<template>
  <transition
    appear
    name="fade"
  >
    <div
      class="iiif-viewer-sidebar border-bottom"
      data-qa="item media sidebar"
    >
      <b-tabs
        id="item-media-sidebar"
        v-model="activeTabIndex"
        vertical
      >
        <!-- Place tooltip outside tab to prevent being lazy loaded -->
        <b-tooltip
          v-if="annotationList"
          target="item-media-sidebar-annotations"
          :title="$t('media.sidebar.annotations')"
          boundary=".iiif-viewer-sidebar"
          placement="right"
          class="ml-0"
        />
        <b-tab
          v-if="annotationList"
          data-qa="item media sidebar annotations"
          button-id="item-media-sidebar-annotations"
          lazy
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
          >
            {{ $t('media.sidebar.annotations') }}
          </h2>
          <MediaAnnotationList
            v-if="activeTabHistory.includes('#annotations')"
            :active="activeTabHash === '#annotations'"
            class="iiif-viewer-sidebar-panel"
          />
        </b-tab>
        <b-tooltip
          v-if="annotationSearch"
          target="item-media-sidebar-search"
          :title="$t('media.sidebar.search')"
          boundary=".iiif-viewer-sidebar"
          placement="right"
          class="ml-0"
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
            class="iiif-viewer-sidebar-panel"
          />
        </b-tab>
        <b-tooltip
          v-if="!!manifestUri"
          target="item-media-sidebar-links"
          :title="$t('media.sidebar.links')"
          boundary=".iiif-viewer-sidebar"
          placement="right"
          class="ml-0"
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
  import hideTooltips from '@/mixins/hideTooltips';

  export default {
    name: 'ItemMediaSidebar',

    components: {
      BTab,
      BTabs,
      MediaAnnotationList: () => import('../media/MediaAnnotationList.vue'),
      MediaAnnotationSearch: () => import('../media/MediaAnnotationSearch.vue')
    },

    mixins: [hideTooltips],

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

      const { activeTabHash, activeTabHistory, activeTabIndex } = useActiveTab(tabHashes);
      return { activeTabHash, activeTabHistory, activeTabIndex };
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';
  @import '@europeana/style/scss/transitions';

  .iiif-viewer-sidebar {
    width: 300px;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    z-index: 1;
    background-color: $white;

    .tabs {
      background-color: $white;
    }

    .tab-pane {
      overflow-wrap: break-word;
    }

    ::v-deep .tab-content {
      padding: 1rem 0 4rem 0;
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
