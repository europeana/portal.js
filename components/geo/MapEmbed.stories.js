import { storiesOf } from '@storybook/vue';
import MapEmbed from './MapEmbed';

storiesOf('Geo/Map Embed', module)
  .add('Brighton, England, UK', () => ({
    components: {
      MapEmbed
    },
    data() {
      return {
        brighton: {
          latitude: 50.82838,
          longitude: -0.13947
        }
      };
    },
    template: `
      <b-container class="mt-3">
        <MapEmbed
          :latitude="brighton.latitude"
          :longitude="brighton.longitude"
        />
      </b-container>`
  }));
