<template>
  <div
    class="map-embed"
    data-qa="map embed"
  >
    <label
      for="map-embed"
      class="p-3"
    >
      <span
        :lang="localisedPrefLabel.code"
      >
        {{ localisedPrefLabel.values[0] }}
      </span>
      {{ formattedCoordinates }}
    </label>
    <iframe
      id="map-embed"
      width="100%"
      height="576"
      frameborder="0"
      scrolling="no"
      marginheight="0"
      marginwidth="0"
      :src="iframeSrc"
    />
  </div>
</template>

<script>
  import { langMapValueForLocale } from  '../../plugins/europeana/utils';

  export default {
    name: 'MapEmbed',

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
        longitudeBoundaryDegrees: 10,
        showLocationMap: false
      };
    },

    computed: {
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
      },

      iframeSrc() {
        return `https://www.openstreetmap.org/export/embed.html?marker=${this.marker}&bbox=${this.bbox}&layer=mapnik`;
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import './assets/scss/variables.scss';

  .map-embed {
    label {
      font-size: $font-size-small;
      display: block;
      margin-bottom: 0;
    }
    iframe {
      display: block;
    }
  }
</style>
