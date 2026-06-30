<template>
  <div class="my-5">
    <client-only>
      <div class="m-2 d-inline-block">
        <b-form-checkbox
          v-model="greyscale"
          name="map-greyscale"
          switch
        >
          Greyscale
        </b-form-checkbox>

        <b-dropdown
          variant="light"
          toggle-class="text-decoration-none"
        >
          <template slot="button-content">
            {{ selectedStyle.name }}
          </template>

          <b-dropdown-item
            v-for="(style, index) in availableStyles"
            :key="index"
            :to="{ ...$route, query: { style: style.name } }"
          >
            {{ style.name }}
          </b-dropdown-item>
        </b-dropdown>
      </div>
      <div
        id="europeana-map"
        class="europeana-map"
        :class="{ 'greyscale': greyscale }"
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
        // EUROPEANA_MAP_CDN_BASE_URL: 'https://cdn.jsdelivr.net/npm/@europeana/map@0.1.1-map.2/dist',
        EUROPEANA_MAP_CDN_BASE_URL: 'http://localhost:4173',
        EUROPEANA_MAP_GEO_JSON_URL: `${this.$config.app.baseUrl}/_api/collections/organisations/geo`,
        availableStyles: [
          { name: 'OpenStreetMap', value: null },
          { name: 'OpenFreeMap - Bright', value: 'https://tiles.openfreemap.org/styles/bright' },
          { name: 'OpenFreeMap - Dark', value: 'https://tiles.openfreemap.org/styles/dark' },
          { name: 'OpenFreeMap - Fiord', value: 'https://tiles.openfreemap.org/styles/fiord' },
          { name: 'OpenFreeMap - Liberty', value: 'https://tiles.openfreemap.org/styles/liberty' },
          { name: 'OpenFreeMap - Positron', value: 'https://tiles.openfreemap.org/styles/positron' },
          { name: 'VersaTiles - Colorful', value: 'https://tiles.versatiles.org/assets/styles/colorful/style.json' },
          { name: 'VersaTiles - Europeana', value: require('@europeana/style/map/versatiles.json') }
        ],
        europeanaMap: null,
        greyscale: false
      };
    },

    computed: {
      selectedStyle() {
        return this.availableStyles.find((style) => style.name === this.$route.query.style) || this.availableStyles[0];
      }
    },

    watch: {
      selectedStyle() {
        this.europeanaMap.set('style', this.selectedStyle.value);
      }
    },

    mounted() {
      waitFor(() => window.EuropeanaMap, { name: 'EuropeanaMap' })
        .then(() => {
          this.europeanaMap = new window.EuropeanaMap('#europeana-map', {
            style: this.selectedStyle.value,
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

  &.greyscale {
    filter: grayscale(100%);
  }
}
</style>
