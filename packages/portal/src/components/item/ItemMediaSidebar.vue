<template>
  <transition
    name="fade"
  >
    <div
      v-show="show"
      class="media-viewer-sidebar"
      data-qa="item media sidebar"
    >
      <!-- TODO: create reusable component for tabs e.g. ItemMediaSidebarTab -->
      <b-tabs
        :id="sidebarId"
        v-model="activeTabIndex"
        vertical
      >
        <template
          v-if="shouldRenderTab('annotations')"
        >
          <!-- Place tooltip outside tab to prevent being lazy loaded -->
          <b-tooltip
            :target="annotationsTabButtonId"
            :title="$t('media.sidebar.annotations')"
            boundary=".media-viewer-sidebar"
            placement="right"
            custom-class="ml-0"
          />
          <b-tab
            data-qa="item media sidebar annotations"
            :button-id="annotationsTabButtonId"
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
        </template>
        <template
          v-if="shouldRenderTab('search')"
        >
          <b-tooltip
            :target="searchTabButtonId"
            :title="$t('media.sidebar.search')"
            boundary=".media-viewer-sidebar"
            placement="right"
            custom-class="ml-0"
          />
          <b-tab
            data-qa="item media sidebar search"
            :button-id="searchTabButtonId"
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
        </template>
        <template
          v-if="shouldRenderTab('metadata')"
        >
          <b-tooltip
            :target="metadataTabButtonId"
            :title="$t('media.sidebar.metadata')"
            boundary=".media-viewer-sidebar"
            placement="right"
            custom-class="ml-0"
          />
          <b-tab
            data-qa="item media sidebar metadata"
            :button-id="metadataTabButtonId"
            lazy
            :title-link-attributes="{ 'aria-label': $t('media.sidebar.metadata'), href: '#metadata' }"
          >
            <template #title>
              <span
                class="icon icon-metadata"
                @mouseleave="hideTooltips"
              />
            </template>
            <div class="title-wrapper px-3 mb-3">
              <h2 class="d-inline mb-0 mr-1">
                {{ $t('media.sidebar.metadata') }}<!-- This comment removes white space
              -->
              </h2><!-- This comment removes white space
              --><b-button
                v-b-tooltip.bottom
                :title="$t('media.sidebar.metadataInfo')"
                class="icon-info-outline p-0 tooltip-button"
                variant="light-flat"
              />
            </div>
            <MediaMetadataList
              :web-resource="webResource"
            />
          </b-tab>
        </template>
        <template
          v-if="shouldRenderTab('links')"
        >
          <b-tooltip
            :target="linksTabButtonId"
            :title="$t('media.sidebar.links')"
            boundary=".media-viewer-sidebar"
            placement="right"
            custom-class="ml-0"
          />
          <b-tab
            data-qa="item media sidebar links"
            :button-id="linksTabButtonId"
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
            <h3 class="px-3 font-base mb-2">
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
        </template>
      </b-tabs>
    </div>
  </transition>
</template>

<script>
  import { BTab, BTabs } from 'bootstrap-vue';

  import useActiveTab from '@/composables/activeTab.js';
  import useHideTooltips from '@/composables/hideTooltips.js';
  import MediaMetadataList from '../media/MediaMetadataList.vue';

  export default {
    name: 'ItemMediaSidebar',

    components: {
      BTab,
      BTabs,
      MediaAnnotationList: () => import('../media/MediaAnnotationList.vue'),
      MediaAnnotationSearch: () => import('../media/MediaAnnotationSearch.vue'),
      MediaMetadataList
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
      webResource: {
        type: Object,
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
      const annotationsTabButtonId = 'item-media-sidebar-annotations-button';
      const searchTabButtonId = 'item-media-sidebar-search-button';
      const linksTabButtonId = 'item-media-sidebar-links-button';
      const metadataTabButtonId = 'item-media-sidebar-metadata-button';

      const tabHashes = [];
      if (props.annotationList) {
        tabHashes.push('#annotations');
      }
      if (props.annotationSearch) {
        tabHashes.push('#search');
      }
      if (props.webResource) {
        tabHashes.push('#metadata');
      }
      if (props.manifestUri) {
        tabHashes.push('#links');
      }

      const { activeTabHash, activeTabHistory, activeTabIndex, watchTabIndex, unwatchTabIndex } = useActiveTab(tabHashes);
      const { hideTooltips } = useHideTooltips([annotationsTabButtonId, searchTabButtonId, linksTabButtonId, metadataTabButtonId]);

      return {
        activeTabHash,
        activeTabHistory,
        activeTabIndex,
        annotationsTabButtonId,
        hideTooltips,
        linksTabButtonId,
        metadataTabButtonId,
        searchTabButtonId,
        tabHashes,
        watchTabIndex,
        unwatchTabIndex
      };
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
      },

      shouldRenderTab(tab) {
        return this.tabHashes.includes(`#${tab}`);
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';
  @import '@europeana/style/scss/transitions';

  .media-viewer-sidebar {
    width: pxToRem(300);
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

      h2,
      .tooltip-button {
        font-size: 1.125rem;
        line-height: 1.5rem;
      }

      .title-wrapper {
        max-width: calc(100% - 1.125rem); // leave space for absolute positioned tooltip button
        position: relative;

        .tooltip-button {
          vertical-align: text-top;
          position: absolute;
          line-height: 1.625rem;
        }
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
