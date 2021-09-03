import { storiesOf } from '@storybook/vue';
import Vuex from 'vuex';
import SearchFilters from '../../../src/components/search/SearchFilters.vue';

const i18n = {
  locale: 'en',
  messages: {
    en: {
      facets: {
        'TYPE': {
          name: 'Type'
        },
        'REUSABILITY': {
          name: 'Can I use this?'
        }
      },
      formatting: {
        labelledValue: '{label}: {value}'
      }
    }
  }
};

const store = () => new Vuex.Store({
  getters: {
    'search/filters': () => 'fulltext',
    'search/formatFacetFieldLabel': () => () => {}
  }
});

const template = '<b-container class="mt-3"><SearchFilters /></b-container>';

storiesOf('Search / Selected facets', module)
  .add('One selected facet', () => ({
    components: { SearchFilters },
    store,
    data() {
      return { facets: { 'TYPE': ['IMAGE'] } };
    },
    i18n,
    template
  }))
  .add('Multiple selected facets', () => ({
    components: { SearchFilters },
    store,
    data() {
      return { facets: { 'TYPE': ['IMAGE', 'VIDEO'], 'REUSABILITY': ['open'] } };
    },
    i18n,
    template
  }));
