<template>
  <div>
    <ul
      class="media-viewer-metadata-list list-group"
    >
      <template
        v-for="field in FIELDS"
      >
        <li
          v-if="webResource[field]"
          :key="field"
        >
          <MetadataField
            class="p-3"
            :name="field"
            :field-data="webResource[field]"
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
  import WebResource from '@/plugins/europeana/edm/WebResource.js';

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
      webResource: {
        type: WebResource,
        required: true
      }
    },

    data() {
      return {
        FIELDS
      };
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';

  .media-viewer-metadata-list {
    border-top: 1px solid $lightbluemagenta;
  }
</style>
