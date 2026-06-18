<template>
  <div class="my-5">
    <client-only>
      <div
        id="europeana-map"
        class="europeana-map"
        width="100vh"
        height="80vh"
        :data-api-url="`${$config.app.baseUrl}/_api/collections/organisations/geo`"
      />
      <script
        type="module"
        src="http://localhost:4173/europeana-map.app.openlayers.js"
      >
        <!-- prevent eslint closing this -->
      </script>
      <link
        rel="preload"
        as="style"
        href="http://localhost:4173/europeana-map.css"
      >
      <link
        rel="stylesheet"
        href="http://localhost:4173/europeana-map.css"
      >
    </client-only>
  </div>
</template>

<script>
  export default {
    name: 'EntityOrganisationsMap'
  };
</script>

<style lang="scss" scoped>
.europeana-map {
  width: 100%;
  height: 80vh;
  position: relative;
}
</style>
