import { storiesOf } from '@storybook/vue';
import VueI18n from 'vue-i18n';
import TabbedLayout from './TabbedLayout.vue';

const i18n = new VueI18n();

storiesOf('Account', module)
  .add('Tabbed Layout', () => ({
    i18n,
    components: { TabbedLayout },
    data() {
      return {
        selectedTab: '0',
        tabs: [
          {
            "id": 0,
            "title": "Red Shoes",
            "view": "grid",
            "card": "https://api.europeana.eu/record/search.json?facet=&profile=minimal&query=red%20shoes&rows=24&start=1&wskey=nLbaXYaiH",
          },
          {
            "id": 1,
            "title": "Green Shoes",
            "view": "grid",
            "card": "https://api.europeana.eu/record/search.json?facet=&profile=minimal&query=green%20shoes&rows=24&start=1&wskey=nLbaXYaiH",
          },
          {
            "id": 2,
            "title": "Blue Shoes",
            "view": "grid",
            "card": "https://api.europeana.eu/record/search.json?facet=&profile=minimal&query=blue%20shoes&rows=24&start=1&wskey=nLbaXYaiH",
          }
        ]
      };
    },
    template: `<b-container
    	<TabbedLayout
        :selectedTab="selectedTab"
        :tabs="tabs"
      />
    </b-container>`
  }));
