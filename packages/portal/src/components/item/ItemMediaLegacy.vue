<template>
  <div
    v-if="iiifPresentationManifest"
    class="iiif-viewer-wrapper d-flex flex-column"
  >
    <slot name="item-language-selector" />
    <IIIFMiradorViewer
      :uri="iiifPresentationManifest"
      :search-query="fulltextSearchQuery"
      :aria-label="$t('actions.viewDocument')"
      :item-id="identifier"
      :provider-url="providerUrl"
      @select="selectMedia"
    />
  </div>
  <ItemMediaSwiper
    v-else
    :europeana-identifier="itemId"
    :edm-type="edmType"
    :displayable-media="webResources"
    @select="selectMedia"
  />
</template>

<script>
  export default {
    name: 'ItemMediaLegacy',

    components: {
      IIIFMiradorViewer: () => import('../iiif/IIIFMiradorViewer'),
      ItemMediaSwiper: () => import('./ItemMediaSwiper')
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

    methods: {
      selectMedia(id) {
        this.$emit('select', id);
      }
    }
  };
</script>

<style lang="scss">
  @import '@europeana/style/scss/variables';
  @import '@europeana/style/scss/iiif';
</style>
