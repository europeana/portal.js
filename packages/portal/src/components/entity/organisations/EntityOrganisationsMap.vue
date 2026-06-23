<template>
  <div class="my-5">
    <client-only>
      <div
        id="europeana-map"
        class="europeana-map"
        width="100vh"
        height="80vh"
        data-url="https://www.europeana.eu/_api/collections/organisations/geo"
      />
      <script
        type="module"
        src="https://cdn.jsdelivr.net/npm/@europeana/map@0.0.4-map.2/dist/europeana-map.app.js"
      >
        <!-- prevent eslint closing this -->
      </script>
      <link
        rel="preload"
        as="style"
        href="https://cdn.jsdelivr.net/npm/@europeana/map@0.0.4-map.2/dist/europeana-map.css"
      >
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/@europeana/map@0.0.4-map.2/dist/europeana-map.css"
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
