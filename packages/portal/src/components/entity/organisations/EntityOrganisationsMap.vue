<template>
  <div class="my-5">
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
  import EntityOrganisationsMapPinPopover from './EntityOrganisationsMapPinPopover.vue';

  const VUE_3_CDN_BASE_URL = 'https://cdn.jsdelivr.net/npm/vue@3.5.39/dist';
  const VUE_3_SCRIPT_URL = `${VUE_3_CDN_BASE_URL}/vue.global.prod.js`;

  const EUROPEANA_MAP_CDN_BASE_URL = 'https://cdn.jsdelivr.net/npm/@europeana/map@0.1.8/dist';
  // const EUROPEANA_MAP_CDN_BASE_URL = 'http://localhost:4173';
  const EUROPEANA_MAP_SCRIPT_URL = `${EUROPEANA_MAP_CDN_BASE_URL}/europeana-map.iife.js`;
  const EUROPEANA_MAP_STYLE_URL = `${EUROPEANA_MAP_CDN_BASE_URL}/europeana-map.css`;

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
        EUROPEANA_MAP_GEO_JSON_URL: `${this.$config.app.baseUrl}/_api/collections/organisations/geo`,
        clickedFeatureId: null,
        controls: {
          fullscreen: {
            label: this.$t('media.controls.fullscreen'),
            labelActive: this.$t('media.controls.exitFullscreen'),
            tipLabel: ' ' // setting this to "" does not prevent title tooltip
          },
          zoom: {
            zoomInLabel: this.$t('media.controls.zoomIn'),
            zoomOutLabel: this.$t('media.controls.zoomOut'),
            zoomInTipLabel: '',
            zoomOutTipLabel: ''
          },
          attribution: {
            collapsible: true,
            label: this.$t('attribution.show'),
            collapseLabel: this.$t('attribution.hide'),
            tipLabel: ''
          }
        },
        europeanaMap: null,
        vue3Loaded: false
      };
    },

    head() {
      return {
        link: [
          { rel: 'preload', as: 'script', href: VUE_3_SCRIPT_URL },
          { rel: 'preload', as: 'script', href: EUROPEANA_MAP_SCRIPT_URL },
          { rel: 'preload', as: 'style', href: EUROPEANA_MAP_STYLE_URL },
          { rel: 'stylesheet', href: EUROPEANA_MAP_STYLE_URL }
        ],
        script: [
          {
            hid: 'vue3',
            src: VUE_3_SCRIPT_URL,
            callback: this.handleLoadVue3
          },
          {
            hid: 'europeana-map',
            src: EUROPEANA_MAP_SCRIPT_URL,
            skip: !this.vue3Loaded,
            callback: this.handleLoadEuropeanaMap
          }
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

    methods: {
      handleLoadVue3() {
        this.vue3Loaded = true;
      },
      handleLoadEuropeanaMap() {
        this.europeanaMap = new window.EuropeanaMap.EuropeanaMapWrapper('#europeana-map', {
          controls: this.controls,
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
