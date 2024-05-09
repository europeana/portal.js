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
  import { langMapValueForLocale } from '@europeana/i18n/langMap.js';

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
  @import '@europeana/style/scss/variables';

  .map-embed {
    label {
      font-size: $font-size-small;
      display: block;
      margin-bottom: 0;
    }
  }
</style>
