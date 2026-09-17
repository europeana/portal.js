<template>
  <EmbedEuropeanaMap
    :json="json"
  >
    <template #label>
      <span
        :lang="langAttribute(localisedLabel.code, $i18n.locale)"
      >
        {{ localisedLabel.values[0] }}
      </span>
      {{ formattedCoordinates }}
    </template>
  </EmbedEuropeanaMap>
</template>

<script>
  import { langAttribute } from '@/utils/langAttribute.js';
  import { langMapValueForLocale } from '@europeana/i18n';
  import EmbedEuropeanaMap from '@/components/embed/EmbedEuropeanaMap.vue';

  export default {
    name: 'ItemLocationMap',

    components: {
      EmbedEuropeanaMap
    },

    props: {
      location: {
        type: Object,
        required: true
      }
    },

    computed: {
      json() {
        return JSON.stringify({
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
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

      prefLabel() {
        return this.location.prefLabel;
      },

      latitude() {
        return this.location.latitude;
      },

      longitude() {
        return this.location.longitude;
      },

      localisedLabel() {
        return langMapValueForLocale(this.prefLabel, this.$i18n.locale);
      },

      formattedCoordinates() {
        const latitudeSymbol = this.latitude < 0 ? 'S' : 'N';
        const longitudeSymbol = this.longitude < 0 ? 'W' : 'E';
        return `${this.latitude}° ${latitudeSymbol} ${this.longitude}° ${longitudeSymbol}`;
      }
    },

    methods: {
      langAttribute
    }
  };
</script>
