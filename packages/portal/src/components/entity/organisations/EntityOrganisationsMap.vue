<template>
  <div class="w-100">
    <EmbedEuropeanaMap
      :hash="hash"
      :map-element-id="mapElementId"
      :on="on"
      :url="EUROPEANA_MAP_GEO_JSON_URL"
      :zoom="1"
    >
      <template #popover>
        <EntityOrganisationsMapPinPopover
          :entity-id="clickedFeatureId"
          @close="handleClosePopover"
        />
      </template>
    </EmbedEuropeanaMap>
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
      },

      mapElementId: {
        type: String,
        default: 'europeana-map'
      }
    },

    data() {
      return {
        EUROPEANA_MAP_GEO_JSON_URL: `${this.$config.app.baseUrl}/_api/collections/organisations/geo`,
        clickedFeatureId: null,
        on: { 'change:activefeature': this.handleChangeActiveFeature }
      };
    },

    methods: {
      handleChangeActiveFeature(e) {
        // Close popover when already active
        if (this.clickedFeatureId === e.activeFeatureName) {
          this.handleClosePopover();
        } else {
          this.clickedFeatureId = e.activeFeatureName;
        }
      },
      handleClosePopover() {
        this.clickedFeatureId = null;
      }
    }
  };
</script>
