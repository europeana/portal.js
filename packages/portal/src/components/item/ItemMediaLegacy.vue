<template>
  <div
    v-if="uri"
    class="iiif-viewer-wrapper d-flex flex-column"
  >
    <IIIFMiradorViewer
      :uri="uri"
      :search-query="searchQuery"
      :item-id="itemId"
      :provider-url="providerUrl"
      :aria-label="$t('actions.viewDocument')"
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
      selectMedia(resource) {
        this.$nextTick(() => {
          this.$emit('select', resource);
        });
      }
    }
  };
</script>

<style lang="scss">
  @import '@europeana/style/scss/variables';
  @import '@europeana/style/scss/iiif';
</style>
