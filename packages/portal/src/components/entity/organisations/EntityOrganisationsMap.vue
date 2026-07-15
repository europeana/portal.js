<template>
  <div class="mb-5">
    <div
      id="europeana-map"
      class="europeana-map"
      width="100vh"
      height="80vh"
    />
    <EntityOrganisationsMapPinPopover
      :id="clickedFeatureId"
      ref="popover"
      @close="handlePopoverClose"
    />
  </div>
</template>

<script>
  import waitFor from '@/utils/waitFor.js';
  import EntityOrganisationsMapPinPopover from './EntityOrganisationsMapPinPopover.vue';

  export default {
    name: 'EntityOrganisationsMap',

    components: {
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
        EUROPEANA_MAP_CDN_BASE_URL: 'https://cdn.jsdelivr.net/npm/@europeana/map@0.1.5/dist',
        // EUROPEANA_MAP_CDN_BASE_URL: 'http://localhost:4173',
        EUROPEANA_MAP_GEO_JSON_URL: `${this.$config.app.baseUrl}/_api/collections/organisations/geo`,
        europeanaMap: null,
        clickedFeatureId: null
      };
    },

    head() {
      return {
        link: [
          { rel: 'preload', as: 'script', href: `${this.EUROPEANA_MAP_CDN_BASE_URL}/europeana-map.app.iife.js` },
          { rel: 'preload', as: 'style', href: `${this.EUROPEANA_MAP_CDN_BASE_URL}/europeana-map.css` },
          { rel: 'stylesheet', href: `${this.EUROPEANA_MAP_CDN_BASE_URL}/europeana-map.css` }
        ],
        script: [
          { src: `${this.EUROPEANA_MAP_CDN_BASE_URL}/europeana-map.app.iife.js` }
        ]
      };
    },

    computed: {
      mapStyle() {
        if (this.$config.app.map?.style?.startsWith('https://')) {
          return this.$config.app.map.style;
        }
        // TODO: load this from @europeana/style npm pkg via CDN once published,
        //       i.e. remove this hard-coded exception then
        if (this.$config.app.map?.style === '@europeana/style/map/versatiles.json') {
          return require('@europeana/style/map/versatiles.json');
        }
        return null;
      }
    },

    mounted() {
      waitFor(() => window.EuropeanaMap, { name: 'EuropeanaMap' }).then(() => {
        this.europeanaMap = new window.EuropeanaMap('#europeana-map', {
          hash: this.hash,
          pinPopover: this.$refs.popover.$el,
          style: this.mapStyle,
          url: this.EUROPEANA_MAP_GEO_JSON_URL
        });

        // Listen to active (clicked) feature changes
        this.europeanaMap.olMap.on('change:activefeature', this.handleActiveFeatureChange);
      });
    },

    methods: {
      handleActiveFeatureChange(e) {
        if (e.activeFeatureName) {
          this.clickedFeatureId = e.activeFeatureName;
        }
      },
      handlePopoverClose() {
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
  }
</style>
