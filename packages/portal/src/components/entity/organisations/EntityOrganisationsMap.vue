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
  import protomapsStyle from '@europeana/style/map/protomaps.json';

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
      mapStyle() {
        if (this.$config.app.map?.style?.startsWith('https://')) {
          return this.$config.app.map.style;
        }
        if (this.$config.app.map?.style === 'protomaps' && this.$config.protomaps?.apiKey) {
          const style = JSON.parse(JSON.stringify(protomapsStyle).replace(/"name:en"/g, `"name:${this.$i18n.locale}"`));
          style.sources.protomaps.tiles[0] = `${style.sources.protomaps.tiles[0]}?key=${this.$config.protomaps.apiKey}`;
          return style;
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
