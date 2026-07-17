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
      @close="handleClosePopover"
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
        EUROPEANA_MAP_CDN_BASE_URL: 'https://cdn.jsdelivr.net/npm/@europeana/map@0.1.7/dist',
        // EUROPEANA_MAP_CDN_BASE_URL: 'http://localhost:4173',
        EUROPEANA_MAP_GEO_JSON_URL: `${this.$config.app.baseUrl}/_api/collections/organisations/geo`,
        europeanaMap: null,
        clickedFeatureId: null
      };
    },

    head() {
      return {
        link: [
          { rel: 'preload', as: 'script', href: 'https://cdn.jsdelivr.net/npm/vue@3.5.39/dist/vue.global.prod.js' },
          // { rel: 'preload', as: 'script', href: `${this.EUROPEANA_MAP_CDN_BASE_URL}/europeana-map.iife.js` },
          { rel: 'preload', as: 'style', href: `${this.EUROPEANA_MAP_CDN_BASE_URL}/europeana-map.css` },
          { rel: 'stylesheet', href: `${this.EUROPEANA_MAP_CDN_BASE_URL}/europeana-map.css` }
        ],
        script: [
          { src: 'https://cdn.jsdelivr.net/npm/vue@3.5.39/dist/vue.global.prod.js' }
          // { src: `${this.EUROPEANA_MAP_CDN_BASE_URL}/europeana-map.iife.js` }
        ]
      };
    },

    computed: {
      mapStyle() {
        if (this.$config.app.map?.style?.startsWith('https://')) {
          return this.$config.app.map.style;
        }
        if (this.$config.app.map?.style === '@europeana/style/map/versatiles.json') {
          return require('@europeana/style/map/versatiles.json');
        }
        return null;
      }
    },

    mounted() {
      waitFor(() => window.Vue, { name: 'Vue' }).then(() => this.handleLoadVue);
      waitFor(() => window.EuropeanaMap, { name: 'EuropeanaMap' }).then(this.handleLoadEuropeanaMap);
    },

    methods: {
      // With vue and map scripts both in head script elements, there is a race condition as
      // to which gets loaded first, resulting in "Vue is not defined" errors from the map
      // script. This will only add the map script to the document head once Vue is loaded.
      // TODO: make this work with script elements in the document head
      handleLoadVue() {
        const mapScript = document.createElement('script');
        mapScript.setAttribute('src', `${this.EUROPEANA_MAP_CDN_BASE_URL}/europeana-map.iife.js`);
        document.querySelector('head').append(mapScript);
      },
      handleLoadEuropeanaMap() {
        this.europeanaMap = new window.EuropeanaMap.EuropeanaMapWrapper('#europeana-map', {
          hash: this.hash,
          pinPopover: this.$refs.popover.$el,
          style: this.mapStyle,
          url: this.EUROPEANA_MAP_GEO_JSON_URL
        });

        // Listen to active (clicked) feature changes
        this.europeanaMap.olMap.on('change:activefeature', this.handleChangeActiveFeature);
      },
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
