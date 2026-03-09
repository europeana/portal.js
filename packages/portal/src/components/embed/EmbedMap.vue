<template>
  <div
    class="map-embed"
  >
    <label
      for="map-embed"
      class="p-3"
    >
      <span
        :lang="langAttribute(location.lang)"
      >
        {{ location.value }}
      </span>
      {{ formattedCoordinates }}
    </label>
    <div
      class="embed-responsive embed-responsive-16by9"
    >
      <iframe
        id="map-embed"
        data-qa="map embed"
        class="embed-responsive-item"
        :src="iframeSrc"
        :title="$t('record.locationOnMap')"
      />
    </div>
  </div>
</template>

<script>
  import langAttributeMixin from '@/mixins/langAttribute';

  export default {
    name: 'EmbedMap',

    mixins: [langAttributeMixin],

    props: {
      location: {
        type: [Object],
        required: true
      }
    },

    data() {
      return {
        latitudeBoundaryDegrees: 5,
        longitudeBoundaryDegrees: 10
      };
    },

    computed: {
      formattedCoordinates() {
        const latitudeSymbol = this.location.latitude < 0 ? 'S' : 'N';
        const longitudeSymbol = this.location.longitude < 0 ? 'W' : 'E';
        return `${this.location.latitude}° ${latitudeSymbol} ${this.location.longitude}° ${longitudeSymbol}`;
      },

      marker() {
        return `${this.location.latitude},${this.location.longitude}`;
      },

      bbox() {
        const xLat = this.location.latitude - this.latitudeBoundaryDegrees;
        const xLng = this.location.longitude - this.longitudeBoundaryDegrees;
        const yLat = this.location.latitude + this.latitudeBoundaryDegrees;
        const yLng = this.location.longitude + this.longitudeBoundaryDegrees;

        return `${xLng},${xLat},${yLng},${yLat}`;
      },

      iframeSrc() {
        return `https://www.openstreetmap.org/export/embed.html?marker=${this.marker}&bbox=${this.bbox}&layer=mapnik`;
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';

  .map-embed {
    label {
      font-size: $font-size-small;
      display: block;
      margin-bottom: 0;
    }
  }
</style>
