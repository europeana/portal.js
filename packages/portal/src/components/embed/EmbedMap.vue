<template>
  <div
    class="map-embed"
  >
    <label
      for="map-embed"
      class="p-3"
    >
      <span
        :lang="langAttribute(localisedPrefLabel.code)"
      >
        {{ localisedPrefLabel.values[0] }}
      </span>
      {{ formattedCoordinates }}
    </label>
    <div
      class="my-5"
    >
      <client-only>
        <div
          id="europeana-map"
          class="europeana-map"
          width="100vh"
          height="80vh"
          :data-json="geoJSON"
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
  </div>
</template>

<script>
  import langAttributeMixin from '@/mixins/langAttribute';
  import { langMapValueForLocale } from '@europeana/i18n';

  export default {
    name: 'EmbedMap',

    mixins: [langAttributeMixin],

    props: {
      prefLabel: {
        type: [String, Object],
        required: true
      },

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
        longitudeBoundaryDegrees: 10
      };
    },

    computed: {
      geoJSON() {
        return JSON.stringify({
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            // TODO: add id
            // id,
            geometry: {
              type: 'Point',
              coordinates: [
                this.longitude,
                this.latitude
              ]
            }
          }]
        });
      },

      localisedPrefLabel() {
        return langMapValueForLocale(this.prefLabel, this.$i18n.locale);
      },

      formattedCoordinates() {
        const latitudeSymbol = this.latitude < 0 ? 'S' : 'N';
        const longitudeSymbol = this.longitude < 0 ? 'W' : 'E';
        return `${this.latitude}° ${latitudeSymbol} ${this.longitude}° ${longitudeSymbol}`;
      },

      marker() {
        return `${this.latitude},${this.longitude}`;
      },

      bbox() {
        const xLat = this.latitude - this.latitudeBoundaryDegrees;
        const xLng = this.longitude - this.longitudeBoundaryDegrees;
        const yLat = this.latitude + this.latitudeBoundaryDegrees;
        const yLng = this.longitude + this.longitudeBoundaryDegrees;

        return `${xLng},${xLat},${yLng},${yLat}`;
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
