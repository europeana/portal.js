import { storiesOf } from '@storybook/vue';

import MapEmbed from './MapEmbed';

storiesOf('Geo/Map Embed', module)
  .add('Brighton, England, UK', () => ({
    i18n: {
      locale: 'en'
    },
    components: {
      MapEmbed
    },
    data() {
      return {
        prefLabel: {
          en: ['Brighton']
        },
        latitude: 50.82838,
        longitude: -0.13947
      };
    },
    template: `
      <b-container class="mt-3">
        <MapEmbed
          :pref-label="prefLabel"
          :latitude="latitude"
          :longitude="longitude"
        />
      </b-container>`
  }));
