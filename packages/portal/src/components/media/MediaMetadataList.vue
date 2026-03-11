<template>
  <div v-if="displayWebResourceMetadata">
    <ul
      class="media-viewer-metadata-list list-group"
    >
      <li
        v-for="(value, key, index) in displayWebResourceMetadata"
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

  const displayableFields = [
    'about',
    'dcCreator',
    'dcDescription',
    'dcFormat',
    'dcRights',
    'dcSource',
    'dcType',
    'dctermsConformsTo',
    'dctermsCreated',
    'dctermsExtent',
    'dctermsHasPart',
    'dctermsIsFormatOf',
    'dctermsIsPartOf',
    'dctermsIsReferencedBy',
    'dctermsIssued',
    'ebucoreAudioChannelNumber',
    'ebucoreBitRate',
    'ebucoreDuration',
    'ebucoreFileByteSize',
    'ebucoreFrameRate',
    'ebucoreHasMimeType',
    'ebucoreHeight',
    'ebucoreOrientation',
    'ebucoreSampleRate',
    'ebucoreSampleSize',
    'ebucoreWidth',
    'edmCodecName',
    'edmComponentColor',
    'edmHasColorSpace',
    'edmSpatialResolution'
  ];

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
      fullWebResource() {
        const fullWebResource = this.webResources?.find(wr => wr.about === this.resource.edm.about) || this.resource.edm;

        return fullWebResource;
      },
      displayWebResourceMetadata() {
        const filteredData = this.fullWebResource;
        for (const key in filteredData) {
          if (!displayableFields.includes(key)) {
            delete filteredData[key];
          }
        }

        return filteredData;
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
