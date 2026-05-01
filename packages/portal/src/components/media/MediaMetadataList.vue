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
    <template
      v-if="$features.isFormatOfMediaMetadata"
    >
      <div
        v-for="wr, index in downloadableMedia"
        :key="wr.about"
      >
        <b-button
          v-b-toggle="`collapse-${index}`"
          variant="link"
        >
          {{ downloadButtonText(wr) }}
        </b-button>
        <b-collapse
          :id="`collapse-${index}`"
          class="mt-2"
        >
          <ul
            class="media-viewer-metadata-list list-group"
          >
            <template
              v-for="field in FIELDS"
            >
              <li
                v-if="wr[field]"
                :key="field"
              >
                <MetadataField
                  class="p-3"
                  :name="field"
                  :field-data="wr[field]"
                  :label-id="`${field}-label`"
                  context="wr"
                />
              </li>
            </template>
          </ul>
        </b-collapse>
      </div>
    </template>
  </div>
</template>

<script>
  import MetadataField from '../metadata/MetadataField.vue';
  import WebResource from '@/plugins/europeana/edm/WebResource.js';
  import { filesize } from 'filesize';
  import { mediaTypeLabel } from '@/utils/media/mediaTypeLabel.js';

  export const FIELDS = [
    'dcTitle',
    'dcCreator',
    'dcDescription',
    'dcFormat',
    'webResourceDcRights',
    'dcSource',
    'dcType',
    'dctermsConformsTo',
    'dctermsCreated',
    'dctermsExtent',
    'dctermsHasPart',
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
    },
    computed: {
      downloadableMedia() {
        return []
          .concat(this.webResource.dctermsIsFormatOf?.def || [])
          .filter((wr) => wr.isDownloadable);
      }
    },

    methods: {
      downloadButtonText(wr) {
        let text = mediaTypeLabel(wr.ebucoreHasMimeType);
        if (wr.ebucoreFileByteSize) {
          text = `${text} (${filesize(wr.ebucoreFileByteSize)})`;
        }
        return text;
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
