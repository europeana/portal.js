import { storiesOf } from '@storybook/vue';
import Vuex from 'vuex';
import RelatedCollections from './RelatedCollections.vue';

const i18n = {
  locale: 'en',
  messages: {
    en: {
      collectionsYouMightLike: 'Collections you might like'
    }
  }
};

const store = () => new Vuex.Store({
  getters: {
    'apis/config': () => ({
      data: {
        origin: 'http://data.europeana.eu'
      }
    })
  }
});

storiesOf('Generic', module)
  .add('Related Collections', () => ({
    components: { RelatedCollections },
    i18n,
    store,
    data() {
      return {
        relatedCollections: [
          {
            name: 'Emilio Pucci',
            identifier: 'http://data.europeana.eu/agent/base/69103',
            image: 'https://api.europeana.eu/api/v2/thumbnail-by-url.json?uri=http%3A%2F%2Fwww.museum-digital.de%2Fdata%2Fberlin%2Fimages%2Fimport_17%2F201601%2F29193203582.jpg&type=IMAGE'
          },
          {
            name: 'Christian Lacroix',
            identifier: 'http://data.europeana.eu/agent/base/66273',
            image: 'https://api.europeana.eu/api/v2/thumbnail-by-url.json?uri=http%3A%2F%2Frepos.europeanafashion.eu%2Frossimoda%2Fimages%2F01876.JPG&type=IMAGE'
          },
          {
            name: 'Jewellery',
            identifier: 'http://data.europeana.eu/concept/base/41',
            image: 'https://api.europeana.eu/api/v2/thumbnail-by-url.json?uri=https%3A%2F%2Flh3.ggpht.com%2FqLeUWgUhfehQvKsVVJbbvzoHkydP2eJatGBsKXDAistagrkeS5gH4qtVPKU-eVekNdwwkKG9rhBG1N1MtWx0OANVC7M%3Ds0&type=IMAGE'
          },
          {
            name: 'Costume',
            identifier: 'http://data.europeana.eu/concept/base/33',
            image: 'https://api.europeana.eu/api/v2/thumbnail-by-url.json?uri=http%3A%2F%2Fwww2.sls.fi%2Fdatabasen%2Fkundkopior%2Fslsa1270%2Fslsa1270_34_10.jpg&type=IMAGE'
          }
        ]
      };
    },
    template: `
      <b-container
        class='mt-3'
      >
        <RelatedCollections
          :title='$t("collectionsYouMightLike")'
          :related-collections='relatedCollections'
        />
      </b-container>`
  }));
