<template>
  <div class="my-5">
    <client-only>
      <div>
        <b-form-checkbox
          v-model="greyscale"
          name="map-greyscale"
          switch
        >
          Greyscale
        </b-form-checkbox>
      </div>
      <div
        id="europeana-map"
        class="europeana-map"
        :class="{ 'greyscale': greyscale }"
        width="100vh"
        height="80vh"
        :data-url="EUROPEANA_MAP_GEO_JSON_URL"
      />
      <script
        type="module"
        :src="`${EUROPEANA_MAP_CDN_BASE_URL}/europeana-map.app.js`"
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
  export default {
    name: 'EntityOrganisationsMap',

    data() {
      return {
        EUROPEANA_MAP_CDN_BASE_URL: 'https://cdn.jsdelivr.net/npm/@europeana/map@0.1.1-map.1/dist',
        // EUROPEANA_MAP_CDN_BASE_URL: 'http://localhost:4173',
        EUROPEANA_MAP_GEO_JSON_URL: `${this.$config.app.baseUrl}/_api/collections/organisations/geo`,
        greyscale: false
      };
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
