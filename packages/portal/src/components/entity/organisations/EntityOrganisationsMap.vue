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
        if (this.clickedFeatureId === e.activeFeatureName) {
          this.handleClosePopover();
        } else if (e.activeFeatureName) {
          this.clickedFeatureId = e.activeFeatureName;
        }
      },
      handleClosePopover() {
        this.clickedFeatureId = null;
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';

  .europeana-map {
    ::v-deep .ol-control {
      background-color: transparent;

      button {
        border-radius: $border-radius-small;
        box-shadow: $boxshadow;

        &:before {
          background-color: $darkgrey; // colors the icon mask-img
          transition: background-color $standard-transition;
        }

        &:hover:before {
          background-color: $blue; // colors the icon mask-img
        }
      }

      &.ol-attribution {
        border-radius: $border-radius-small;
      }
    }
  }
</style>
