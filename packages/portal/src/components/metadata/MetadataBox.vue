<template>
  <div
    data-qa="metadata box"
  >
    <b-card
      no-body
      class="metadata-box-card mb-3"
    >
      <b-tabs card>
        <b-tab
          :title="$t('record.goodToKnow')"
          data-qa="good to know tab"
          active
        >
          <b-card-text
            text-tag="div"
            data-qa="main metadata section"
          >
            <MetadataField
              v-for="name in CORE_FIELDS"
              :key="name"
              :metadata-language="metadataLanguage"
              :name="name"
              :field-data="metadata[name]"
            />
          </b-card-text>
        </b-tab>
        <b-tab
          :title="$t('record.allMetaData')"
          data-qa="all metadata tab"
        >
          <b-card-text
            text-tag="div"
          >
            <MetadataField
              v-for="name in ALL_FIELDS"
              :key="name"
              :metadata-language="metadataLanguage"
              :name="name"
              :field-data="metadata[name]"
            />
          </b-card-text>
        </b-tab>
        <b-tab
          v-if="Boolean(transcribingAnnotations.length)"
          :title="$t('record.transcription')"
          data-qa="transcription tab"
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
          v-if="mappableLocation"
          :title="$t('record.location')"
          class="p-0"
          data-qa="location tab"
          @click="clickLocationTab"
        >
          <b-card-text
            text-tag="div"
          >
            <EmbedMap
              v-if="mappableLocation && showLocationMap"
              :pref-label="mappableLocation.prefLabel"
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
  import { BTab, BTabs } from 'bootstrap-vue';
  import MetadataField from './MetadataField';

  export default {
    name: 'MetadataBox',

    components: {
      BTab,
      BTabs,
      MetadataField,
      EmbedMap: () => import('../embed/EmbedMap')
    },

    props: {
      metadata: {
        type: Object,
        required: true
      },
      location: {
        type: Object,
        default: null
      },
      metadataLanguage: {
        type: String,
        default: null
      },
      transcribingAnnotations: {
        type: Array,
        default: () => []
      }
    },

    data() {
      return {
        CORE_FIELDS,
        ALL_FIELDS,
        showLocationMap: false
      };
    },

    computed: {
      mappableLocation() {
        return this.location?.def?.find(loc => (
          (typeof loc === 'object') && loc.latitude && loc.longitude
        )) || null;
      }
    },

    methods: {
      clickLocationTab() {
        this.showLocationMap = true;
      }
    }
  };

  const CORE_FIELDS = [
    'dcContributor',
    'dcCreator',
    'dcPublisher',
    'dcSubject',
    'dcType',
    'dcDate',
    'dctermsMedium'
  ];

  const ALL_FIELDS = CORE_FIELDS.concat([
    'edmDataProvider',
    'edmProvider',
    'edmIntermediateProvider',
    'edmRights',
    'edmUgc',
    'dcRights',
    'dctermsCreated',
    'dctermsIssued',
    'dctermsTemporal',
    'dcCoverage',
    'dctermsSpatial',
    'edmCurrentLocation',
    'dctermsProvenance',
    'dcSource',
    'dcIdentifier',
    'dctermsExtent',
    'dcDuration',
    'dcFormat',
    'dcLanguage',
    'dctermsIsPartOf',
    'dcRelation',
    'dctermsReferences',
    'dctermsHasPart',
    'dctermsHasVersion',
    'dctermsIsFormatOf',
    'dctermsIsReferencedBy',
    'dctermsIsReplacedBy',
    'dctermsIsRequiredBy',
    'edmHasMet',
    'edmIncorporates',
    'edmIsDerivativeOf',
    'edmIsRelatedTo',
    'edmIsRepresentationOf',
    'edmIsSimilarTo',
    'edmIsSuccessorOf',
    'edmRealizes',
    'wasPresentAt',
    'year',
    'edmCountry',
    'europeanaCollectionName',
    'timestampCreated',
    'timestampUpdate',
    'keywords',
    'dctermsTOC'
  ]);
</script>

<style lang="scss">
  @import '@europeana/style/scss/variables';
  @import '@europeana/style/scss/tabs';

  .metadata-box-card {
    border: none;
  }
</style>