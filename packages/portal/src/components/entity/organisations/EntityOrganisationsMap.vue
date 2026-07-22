<template>
  <div class="mb-5">
    <EmbedEuropeanaMap
      :hash="hash"
      :url="EUROPEANA_MAP_GEO_JSON_URL"
      :on="on"
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
    width: 100%;
    height: 80vh;
    position: relative;

    ::v-deep .ol-overlay-container {
      @media (max-width: ($bp-small - 1px)) {
        transform: none !important;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 1;
      }
    }

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
