<template>
  <div class="my-5">
    <div
      id="europeana-map"
      class="europeana-map"
      width="100vh"
      height="80vh"
    />
  </div>
</template>

<script>
  import waitFor from '@/utils/waitFor.js';
  import versatilesMapStyleNativeLang from '@europeana/style/map/versatiles.json';

  export default {
    name: 'EntityOrganisationsMap',

    props: {
      hash: {
        type: Boolean,
        default: false
      }
    },

    data() {
      return {
        EUROPEANA_MAP_CDN_BASE_URL: 'https://cdn.jsdelivr.net/npm/@europeana/map@0.1.4/dist',
        // EUROPEANA_MAP_CDN_BASE_URL: 'http://localhost:4173',
        EUROPEANA_MAP_GEO_JSON_URL: `${this.$config.app.baseUrl}/_api/collections/organisations/geo`,
        europeanaMap: null
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
      versatilesMapStyleLocalised() {
        return {
          ...versatilesMapStyleNativeLang,
          layers: versatilesMapStyleNativeLang.layers.map((layer) => {
            if (layer.layout?.['text-field']) {
              const textField = layer.layout?.['text-field'];
              if (textField.length === 2 && textField[0] === 'get' && textField[1] === 'name') {
                return {
                  ...layer,
                  layout: {
                    ...layer.layout,
                    'text-field': [
                      'coalesce',
                      ['get', `name_${this.$i18n.locale}`],
                      ['get', 'name']
                    ]
                  }
                };
              }
            }
            return layer;
          })
        };
      },
      mapStyle() {
        if (this.$config.app.map?.style?.startsWith('https://')) {
          return this.$config.app.map.style;
        }
        if (this.$config.app.map?.style === 'versatiles')  {
          return this.versatilesMapStyleLocalised;
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
        });
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
