<template>
  <div>
    <ul
      class="media-viewer-metadata-list list-group"
    >
      <template
        v-for="field in FIELDS"
      >
        <li
          v-if="fullWebResource[field]"
          :key="field"
        >
          <MetadataField
            class="p-3"
            :name="field"
            :field-data="fullWebResource[field]"
            :label-id="`${field}-label`"
            context="webResource"
          />
        </li>
      </template>
    </ul>
  </div>
</template>

<script>
  import MetadataField from '../metadata/MetadataField.vue';

  const FIELDS = [
    'dcTitle',
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
    'dctermsIssued',
    'dctermsTemporal',
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
    'edmIntendedUsage',
    'edmPolygonCount',
    'edmSpatialResolution',
    'edmVertexCount',
    'schemaDigitalSourceType'
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
       * TODO: this should happen higher up
       */
      webResources: {
        type: Array,
        default: null
      }
    },

    data() {
      return {
        FIELDS
      };
    },

    computed: {
      fullWebResource() {
        const fullWebResource = this.webResources?.find((wr) => wr.about === this.resource.edm.about) || this.resource.edm;

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
