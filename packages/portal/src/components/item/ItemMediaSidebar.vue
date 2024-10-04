<template>
  <transition
    appear
    name="fade"
  >
    <div
      class="iiif-viewer-sidebar border-bottom"
      data-qa="item media sidebar"
    >
      <b-tabs vertical>
        <b-tab
          v-if="annotationUri"
        >
          <template #title>
            <!-- TODO: label for a11y -->
            <!-- TODO: replace with new icon for annotations -->
            <span class="icon icon-text-bold" />
          </template>
          <MediaAnnotationList
            :uri="annotationUri"
            :target-id="annotationTargetId"
            :text-granularity="annotationTextGranularity"
            class="iiif-viewer-sidebar-panel"
            @selectAnno="onSelectAnno"
          />
        </b-tab>
        <b-tab
          v-if="!!manifestUri"
          data-qa="item media sidebar links"
          button-id="item-media-sidebar-links"
          :title-link-attributes="{ 'aria-label': $t('media.sidebar.links') }"
          @mouseleave.native="hideTooltips"
        >
          <b-tooltip
            target="item-media-sidebar-links"
            :title="$t('media.sidebar.links')"
            boundary=".iiif-viewer-sidebar"
          />
          <template #title>
            <span
              class="icon icon-link"
            />
          </template>
          <h2>{{ $t('media.sidebar.links') }}</h2>
          <h3>{{ $t('media.sidebar.IIIFManifest') }}</h3>
          <b-link
            :href="manifestUri"
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
  import hideTooltips from '@/mixins/hideTooltips';

  export default {
    name: 'ItemMediaSidebar',

    components: {
      BTab,
      BTabs,
      MediaAnnotationList: () => import('../media/MediaAnnotationList.vue')
    },

    mixins: [hideTooltips],

    props: {
      annotationTargetId: {
        type: String,
        default: null
      },
      annotationTextGranularity: {
        type: Array, String,
        default: null
      },
      annotationUri: {
        type: String,
        default: null
      },
      manifestUri: {
        type: String,
        default: null
      }
    },

    methods: {
      onSelectAnno(anno) {
        this.$emit('selectAnno', anno);
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';
  @import '@europeana/style/scss/transitions';

  .iiif-viewer-sidebar {
    width: 230px;
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
      padding: 1rem 1.5rem 4rem 0.875rem;
      overflow: auto;

      h2 {
        font-size: 1.125rem;
      }

      h3 {
        font-size: $font-size-base;
        margin-bottom: 0.5rem;
      }

      a {
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
