<template>
  <div v-if="resourceMetadata">
    <ul
      class="media-viewer-metadata-list list-group"
    >
      <li
        v-for="(value, key, index) in resourceMetadata"
        :key="index"
      >
        <MetadataField
          :key="key"
          class="p-3"
          :name="key"
          :field-data="value"
          :label-id="`${key}-label`"
          context="webResource"
        />
      </li>
    </ul>
  </div>
</template>

<script>
  import MetadataField from '../metadata/MetadataField.vue';

  export default {
    name: 'MediaMetadataList',

    components: {
      MetadataField
    },

    props: {
      /**
       * Web resource to display the metadata of
       */
      resource: {
        type: Object,
        required: true
      },
      /**
       * Array of web resources to lookup in case resource does not contain the full data
       */
      webResources: {
        type: Array,
        default: null
      }
    },

    computed: {
      resourceMetadata() {
        const fullWebResource = this.webResources?.find(wr => wr.about === this.resource.edm.about) || this.resource.edm;

        return fullWebResource;
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';

  .media-viewer-metadata-list {
    border-top: 1px solid $lightbluemagenta;
  }
</style>
