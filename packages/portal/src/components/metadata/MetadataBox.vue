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
          :title-link-attributes="{'data-qa': 'good to know tab'}"
          active
        >
          <template #title>
            <h2>{{ $t('record.goodToKnow') }}</h2>
          </template>
          <b-card-text
            text-tag="div"
            data-qa="main metadata section"
          >
            <template
              v-for="name in CORE_FIELDS"
            >
              <MetadataField
                v-if="(metadata[name]?.length || 0) > 0"
                :key="name"
                :name="name"
                :field-data="metadata[name]"
                :label-id="`${name}-main-label`"
              />
            </template>
          </b-card-text>
        </b-tab>
        <b-tab
          :title-link-attributes="{'data-qa': 'all metadata tab'}"
        >
          <template #title>
            <h2>{{ $t('record.allMetaData') }}</h2>
          </template>
          <b-card-text
            text-tag="div"
          >
            <template
              v-for="name in ALL_FIELDS"
            >
              <MetadataField
                v-if="(metadata[name]?.length || 0) > 0"
                :key="name"
                :name="name"
                :field-data="metadata[name]"
                :label-id="`${name}-label`"
              />
            </template>
          </b-card-text>
        </b-tab>
        <b-tab
          v-if="mappableLocation"
          class="p-0"
          :title-link-attributes="{'data-qa': 'location tab'}"
          data-qa="location tab"
          @click="clickLocationTab"
        >
          <template #title>
            <h2>{{ $t('record.location') }}</h2>
          </template>
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
        type: [Object, Array],
        default: null
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
        return [].concat(this.location).find((loc) => loc.latitude && loc.longitude);
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

  export const ALL_FIELDS = CORE_FIELDS.concat([
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
