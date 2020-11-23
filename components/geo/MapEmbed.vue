<template>
  <iframe
    class="map-embed"
    width="100%"
    height="576"
    frameborder="0"
    scrolling="no"
    marginheight="0"
    marginwidth="0"
    :src="iframeSrc"
  />
</template>

<script>
  export default {
    name: 'MapEmbed',

    props: {
      latitude: {
        type: Number,
        required: true
      },

      longitude: {
        type: Number,
        required: true
      }
    },

    data() {
      return {
        latitudeBoundaryDegrees: 5,
        longitudeBoundaryDegrees: 10,
        showLocationMap: false
      };
    },

    computed: {
      marker() {
        return `${this.latitude},${this.longitude}`;
      },

      bbox() {
        const xLat = this.latitude - this.latitudeBoundaryDegrees;
        const xLng = this.longitude - this.longitudeBoundaryDegrees;
        const yLat = this.latitude + this.latitudeBoundaryDegrees;
        const yLng = this.longitude + this.longitudeBoundaryDegrees;

        return `${xLng},${xLat},${yLng},${yLat}`;
      },

      iframeSrc() {
        return `https://www.openstreetmap.org/export/embed.html?marker=${this.marker}&bbox=${this.bbox}&layer=mapnik`;
      }
    }
  };
</script>

<style lang="scss" scoped>
  iframe {
    &.map-embed {
      display: block;
    }
  }
</style>
