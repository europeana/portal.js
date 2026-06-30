<template>
  <div class="my-5">
    <client-only>
      <div
        id="europeana-map"
        class="europeana-map"
        width="100vh"
        height="80vh"
      />
      <link
        rel="preload"
        as="script"
        :href="`${EUROPEANA_MAP_CDN_BASE_URL}/europeana-map.app.iife.js`"
      >
      <script
        :src="`${EUROPEANA_MAP_CDN_BASE_URL}/europeana-map.app.iife.js`"
      >
        <!-- prevent eslint closing this -->
      </script>
      <link
        rel="preload"
        as="style"
        :href="`${EUROPEANA_MAP_CDN_BASE_URL}/europeana-map.css`"
      >
      <link
        rel="stylesheet"
        :href="`${EUROPEANA_MAP_CDN_BASE_URL}/europeana-map.css`"
      >
    </client-only>
  </div>
</template>

<script>
  import waitFor from '@/utils/waitFor.js';

  export default {
    name: 'EntityOrganisationsMap',

    data() {
      return {
        EUROPEANA_MAP_CDN_BASE_URL: 'https://cdn.jsdelivr.net/npm/@europeana/map@0.1.1-map.2/dist',
        // EUROPEANA_MAP_CDN_BASE_URL: 'http://localhost:4173',
        EUROPEANA_MAP_GEO_JSON_URL: `${this.$config.app.baseUrl}/_api/collections/organisations/geo`,
        europeanaMap: null
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
