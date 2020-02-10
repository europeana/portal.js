import { storiesOf } from '@storybook/vue';

import SearchFilters from './SearchFilters.vue';

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

const template = '<b-container class="mt-3"><SearchFilters :facets="facets"/></b-container>';

storiesOf('Search / Selected facets', module)
  .add('One selected facet', () => ({
    components: { SearchFilters },
    data() {
      return { facets: { 'TYPE': ['IMAGE'] } };
    },
    i18n,
    template
  }))
  .add('Multiple selected facets', () => ({
    components: { SearchFilters },
    data() {
      return { facets: { 'TYPE': ['IMAGE', 'VIDEO'], 'REUSABILITY': ['open'] } };
    },
    i18n,
    template
  }));
