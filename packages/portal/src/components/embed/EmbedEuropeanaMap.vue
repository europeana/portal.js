<template>
  <div
    class="embed-map"
  >
    <div
      v-if="$slots.label"
      class="p-3"
    >
      <slot name="label" />
    </div>
    <div
      :id="mapContainerElementId"
      class="europeana-map-container"
      width="100vh"
      height="80vh"
      data-qa="europeana map"
      :json="json"
      :url="url"
    />
    <div
      v-if="$slots.popover"
      :id="popoverElementId"
    >
      <slot
        name="popover"
      />
    </div>
  </div>
</template>

<script>
  import { useEuropeanaMapStyle, EUROPEANA_MAP_STYLE_NAMES } from '@europeana/map-styles';

  const VUE_3_CDN_BASE_URL = 'https://cdn.jsdelivr.net/npm/vue@3.5.39/dist';
  const VUE_3_SCRIPT_URL = `${VUE_3_CDN_BASE_URL}/vue.global.prod.js`;

  const EUROPEANA_MAP_CDN_BASE_URL = 'https://cdn.jsdelivr.net/npm/@europeana/map@0.1.18/dist';
  // const EUROPEANA_MAP_CDN_BASE_URL = 'http://localhost:4173';
  const EUROPEANA_MAP_SCRIPT_URL = `${EUROPEANA_MAP_CDN_BASE_URL}/europeana-map.iife.js`;
  const EUROPEANA_MAP_STYLE_URL = `${EUROPEANA_MAP_CDN_BASE_URL}/europeana-map.css`;

  export default {
    name: 'EmbedMap',

    props: {
      centre: {
        type: Array,
        default: null
      },
      hash: {
        type: Boolean,
        default: false
      },

      json: {
        type: String,
        default: null
      },

      mapElementId: {
        type: String,
        default: 'europeana-map'
      },

      on: {
        type: Object,
        default: () => {}
      },

      url: {
        type: [String, URL],
        default: null
      },
      zoom: {
        type: Number,
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
          },
          keyboardPanAndZoom: {
            label: this.$t('map.keyboardPanAndZoom')
          },
          keyboardNavigatePins: {
            label: this.$t('map.keyboardNavigatePins'),
            srLabel: {
              multiple: this.$t('map.zoomInCluster'),
              single: this.$t('map.togglePin')
            }
          }
        },
        mapContainerElementId: `${this.mapElementId}-container`,
        popoverElementId: `${this.mapElementId}-popover`,
        vue3Loaded: false
      };
    },

    head() {
      return {
        link: [
          { rel: 'preload', as: 'script', href: VUE_3_SCRIPT_URL },
          { rel: 'preload', as: 'script', href: EUROPEANA_MAP_SCRIPT_URL },
          { rel: 'preload', as: 'style', href: EUROPEANA_MAP_STYLE_URL },
          { hid: `${this.mapElementId}-europeana-map-style`, rel: 'stylesheet', href: EUROPEANA_MAP_STYLE_URL }
        ],
        script: [
          {
            hid: `${this.mapElementId}-vue3-script`,
            src: VUE_3_SCRIPT_URL,
            callback: this.handleLoadVue3
          },
          {
            hid: `${this.mapElementId}-europeana-map-script`,
            src: EUROPEANA_MAP_SCRIPT_URL,
            skip: !this.vue3Loaded,
            callback: this.handleLoadEuropeanaMap
          }
        ]
      };
    },

    methods: {
      handleLoadVue3() {
        this.vue3Loaded = true;
      },
      handleLoadEuropeanaMap() {
        let style;
        if (EUROPEANA_MAP_STYLE_NAMES.includes(this.$config.app?.map?.style)) {
          style = useEuropeanaMapStyle(this.$config.app.map.style, { locale: this.$features.localisedMap && this.$i18n.locale });
        }

        // WARNING: consider carefully before storing in data as it will be made reactive
        //          by Vue which is costly on large complex objects
        const europeanaMap = new window.EuropeanaMap.EuropeanaMapWrapper(`#${this.mapContainerElementId}`, {
          centre: this.centre,
          controls: this.controls,
          elementId: this.mapElementId,
          hash: this.hash,
          json: this.json,
          pinPopover: this.$slots.popover && this.popoverElementId,
          style,
          url: this.url,
          zoom: this.zoom
        });

        // Add event handlers
        for (const eventId in this.on) {
          europeanaMap.olMap.on(eventId, this.on[eventId]);
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';

  .embed-map {
    .europeana-map-container {
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
          background-color: $white;
          border-radius: $border-radius-small;
        }

        @at-root .xxl-page & {
          @media (min-width: $bp-4k) {
            right: calc(1.5 * 1.25rem);

            button {
              width: calc(1.5 * 2.25rem);
              height: calc(1.5 * 2.25rem);
              padding: calc(1.5 * 0.25rem);
              margin-bottom: 0.75rem;

              &:before {
                mask-size: calc(1.5 * 1.5rem);
              }
            }

            &.ol-zoom {
              bottom: calc(1.5 * 6.25rem);
            }

            &.ol-full-screen {
              bottom: calc(1.5 * 3.5rem);
            }

            &.ol-attribution {
              bottom: 1.5rem;

              button {
                margin-bottom: 0;
              }

              ul {
                font-size: $font-size-extrasmall-4k;
              }
            }
          }
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
