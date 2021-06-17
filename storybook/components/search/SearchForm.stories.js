import Vuex from 'vuex';
import VueRouter from 'vue-router';
import { storiesOf } from '@storybook/vue';
import SearchForm from '../../../src/components/search/SearchForm.vue';

const router = new VueRouter({
  routes: [
    {
      path: '/search',
      query: 'search'
    }
  ]
});

const store = (searchState = {}, entity = {}) => new Vuex.Store({
  state: {
    search: searchState,
    entity,
    i18n: {
      locale: 'en'
    }
  },
  getters: {
    'search/queryUpdatesForFacetChanges': () => () => {}
  }
});

const i18n = {
  locale: 'en',
  messages: {
    en: {
      searchPlaceholder: 'What are you looking for?',
      header: {
        clearQuery: 'Clear Search Query',
        entireCollection: 'Search for {query} in our entire collection',
        inCollection: 'Search for {query} in {collection}',
        searchFor: 'Search for {query}',
        searchForEverythingInCollection: 'Search for everything in {collection}',
        searchForEverythingInEntireCollection: 'Search for everything in our entire collection',
        searchForEverything: 'Search for everything'
      }
    }
  }
};

storiesOf('Search / Form', module)
  .add('Default style', () => ({
    components: { SearchForm },
    store,
    i18n,
    router,
    template: '<b-container class="mt-3"><SearchForm /></b-container>'
  }))
  .add('Within a collection', () => ({
    components: { SearchForm },
    store: store({
      collectionLabel: 'Byzantine art'
    }, {
      id: 'http://data.europeana.eu/concept/207'
    }),
    i18n,
    router,
    template: '<b-container class="mt-3"><SearchForm/></b-container>'
  }));
