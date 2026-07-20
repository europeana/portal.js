<template>
  <div class="mb-5">
    <EmbedEuropeanaMap
      :hash="hash"
      :url="EUROPEANA_MAP_GEO_JSON_URL"
      :on="{ 'change:activefeature': handleChangeActiveFeature }"
    />
    <EntityOrganisationsMapPinPopover
      :id="clickedFeatureId"
      @close="handleClosePopover"
    />
  </div>
</template>

<script>
  import EmbedEuropeanaMap from '@/components/embed/EmbedEuropeanaMap.vue';
  import EntityOrganisationsMapPinPopover from './EntityOrganisationsMapPinPopover.vue';

  export default {
    name: 'EntityOrganisationsMap',

    components: {
      EmbedEuropeanaMap,
      EntityOrganisationsMapPinPopover
    },

    props: {
      hash: {
        type: Boolean,
        default: false
      }
    },

    data() {
      return {
        EUROPEANA_MAP_GEO_JSON_URL: `${this.$config.app.baseUrl}/_api/collections/organisations/geo`,
        clickedFeatureId: null
      };
    },

    methods: {
      handleChangeActiveFeature(e) {
        if (e.activeFeatureName) {
          this.clickedFeatureId = e.activeFeatureName;
        }
      },
      handleClosePopover() {
        this.clickedFeatureId = null;
      }
    }
  };
</script>
