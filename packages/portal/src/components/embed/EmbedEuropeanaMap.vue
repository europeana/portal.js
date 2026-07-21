<template>
  <div
    class="embed-map mb-5"
  >
    <div
      v-if="$slots.label"
      class="p-3"
    >
      <slot name="label" />
    </div>
    <div
      id="europeana-map"
      class="europeana-map"
      width="100vh"
      height="80vh"
      data-qa="europeana map"
      :json="json"
      :url="url"
    />
    <div
      v-if="$slots.popover"
      id="europeana-map-popover"
    >
      <slot
        name="popover"
      />
    </div>
  </div>
</template>

<script>
  const VUE_3_CDN_BASE_URL = 'https://cdn.jsdelivr.net/npm/vue@3.5.39/dist';
  const VUE_3_SCRIPT_URL = `${VUE_3_CDN_BASE_URL}/vue.global.prod.js`;

  const EUROPEANA_MAP_CDN_BASE_URL = 'https://cdn.jsdelivr.net/npm/@europeana/map@0.1.8/dist';
  // const EUROPEANA_MAP_CDN_BASE_URL = 'http://localhost:4173';
  const EUROPEANA_MAP_SCRIPT_URL = `${EUROPEANA_MAP_CDN_BASE_URL}/europeana-map.iife.js`;
  const EUROPEANA_MAP_STYLE_URL = `${EUROPEANA_MAP_CDN_BASE_URL}/europeana-map.css`;

  export default {
    name: 'EmbedMap',

    props: {
      hash: {
        type: Boolean,
        default: false
      },

      json: {
        type: String,
        default: null
      },

      on: {
        type: Object,
        default: () => {}
      },

      url: {
        type: [String, URL],
        default: null
      }
    },

    data() {
      return {
        EUROPEANA_MAP_GEO_JSON_URL: `${this.$config.app.baseUrl}/_api/collections/organisations/geo`,
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
          { hid: 'europeana-map-style', rel: 'stylesheet', href: EUROPEANA_MAP_STYLE_URL }
        ],
        script: [
          {
            hid: 'vue3-script',
            src: VUE_3_SCRIPT_URL,
            callback: this.handleLoadVue3
          },
          {
            hid: 'europeana-map-script',
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
          json: this.json,
          pinPopover: 'europeana-map-popover',
          style: this.mapStyle,
          url: this.url
        });

        // Add event handlers
        for (const eventId in this.on) {
          this.europeanaMap.olMap.on(eventId, this.on[eventId]);
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';

  .embed-map {
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

    label {
      font-size: $font-size-small;
      display: block;
      margin-bottom: 0;
    }
  }
</style>
