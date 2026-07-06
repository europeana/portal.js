<template>
  <div class="my-5">
    <div
      id="europeana-map"
      class="europeana-map"
      width="100vh"
      height="80vh"
    />
    <EntityOrganisationsMapPinPopup
      :id="clickedFeatureId"
      ref="popover"
    />
  </div>
</template>

<script>
  import waitFor from '@/utils/waitFor.js';
  import EntityOrganisationsMapPinPopup from './EntityOrganisationsMapPinPopup.vue';
  import Overlay from 'ol/Overlay.js';

  export default {
    name: 'EntityOrganisationsMap',

    components: {
      EntityOrganisationsMapPinPopup
    },

    props: {
      hash: {
        type: Boolean,
        default: false
      }
    },

    data() {
      return {
        EUROPEANA_MAP_CDN_BASE_URL: 'https://cdn.jsdelivr.net/npm/@europeana/map@0.1.2/dist',
        // EUROPEANA_MAP_CDN_BASE_URL: 'http://localhost:4173',
        EUROPEANA_MAP_GEO_JSON_URL: `${this.$config.app.baseUrl}/_api/collections/organisations/geo`,
        europeanaMap: null,
        overlay: null,
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
        if (this.$config.app.map?.style === '@europeana/style/map/versatiles.json')  {
          return require('@europeana/style/map/versatiles.json');
        }
        return null;
      }
    },

    mounted() {
      waitFor(() => window.EuropeanaMap, { name: 'EuropeanaMap' })
        .then(() => {
          this.europeanaMap = new window.EuropeanaMap('#europeana-map', {
            hash: this.hash,
            style: this.mapStyle,
            url: this.EUROPEANA_MAP_GEO_JSON_URL
          });

          // Create an overlay to anchor the popover to the map.
          this.overlay = new Overlay({
            element: this.$refs.popover.$el,
            autoPan: {
              animation: {
                duration: 250
              }
            }
          });
          this.europeanaMap.olMap.addOverlay(this.overlay);

          this.europeanaMap.olMap.on('click', this.handleClick);
        });
    },

    methods: {
      handleClick(e) {
        const clickedFeatures = this.europeanaMap.olMap.getFeaturesAtPixel(e.pixel);
        const features = clickedFeatures[0]?.get('features');

        if (features?.length === 1) {
          this.clickedFeatureId = features[0].get('name');
          const coordinates = features[0].getGeometry().flatCoordinates;
          this.overlay.setPosition(coordinates);
        }
        // }
        // });
      }
    }
  };
</script>

<style lang="scss" scoped>
.europeana-map {
  width: 100%;
  height: 80vh;
  position: relative;
}
</style>
