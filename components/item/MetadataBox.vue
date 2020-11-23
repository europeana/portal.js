<template>
  <div>
    <b-card
      no-body
      class="mb-3"
    >
      <b-tabs card>
        <b-tab
          :title="$t('record.goodToKnow')"
          active
        >
          <b-card-text
            text-tag="div"
            data-qa="main metadata section"
          >
            <MetadataField
              v-for="(value, name) in coreMetadata"
              :key="name"
              :name="name"
              :field-data="value"
            />
          </b-card-text>
        </b-tab>
        <b-tab
          :title="$t('record.allMetaData')"
        >
          <b-card-text
            text-tag="div"
          >
            <MetadataField
              v-for="(value, name) in allMetadata"
              :key="name"
              :name="name"
              :field-data="value"
            />
          </b-card-text>
        </b-tab>
        <b-tab
          v-if="Boolean(transcribingAnnotations.length)"
          :title="$t('record.transcription')"
        >
          <b-card-text
            text-tag="div"
          >
            <p
              class="disclaimer px-2 pb-3 d-flex"
            >
              {{ $t('record.transcriptionDisclaimer') }}
            </p>
            <div
              v-for="(transcription, index) in transcribingAnnotations"
              :key="index"
              :lang="transcription.body.language"
            >
              <p>{{ transcription.body.value }}</p>
              <hr
                v-if="index !== (transcribingAnnotations.length - 1)"
              >
            </div>
          </b-card-text>
        </b-tab>
        <b-tab
          v-if="location"
          :title="$t('record.location')"
          class="p-0"
          @click="clickLocationTab"
        >
          <b-card-text
            text-tag="div"
            data-qa="location section"
          >
            <MetadataField
              name="dctermsSpatial"
              class="p-3"
              :field-data="location"
            />
            <MapEmbed
              v-if="mappableLocation && showLocationMap"
              :latitude="mappableLocation.latitude"
              :longitude="mappableLocation.longitude"
            />
          </b-card-text>
        </b-tab>
      </b-tabs>
    </b-card>
  </div>
</template>

<script>
  import MetadataField from './MetadataField';

  export default {
    name: 'MetadataBox',

    components: {
      MetadataField,
      MapEmbed: () => import('../geo/MapEmbed')
    },

    props: {
      coreMetadata: {
        type: Object,
        default: null
      },
      allMetadata: {
        type: Object,
        default: null
      },
      transcribingAnnotations: {
        type: Array,
        default: () => []
      },
      location: {
        type: Object,
        default: null
      }
    },

    data() {
      return {
        showLocationMap: false
      };
    },

    computed: {
      mappableLocation() {
        if (!this.location || !this.location.def) return null;
        return this.location.def.find(loc => (
          (typeof loc === 'object') && loc.latitude && loc.longitude
        ));
      }
    },

    methods: {
      clickLocationTab() {
        this.showLocationMap = true;
      }
    }
  };
</script>
