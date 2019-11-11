import Vuex from 'vuex';
import VueRouter from 'vue-router';
import { storiesOf } from '@storybook/vue';
import SearchForm from './SearchForm.vue';

const router = new VueRouter({
  routes: [
    {
      path: '/search',
      query: 'search'
    }
  ]
});

const store = (searchState = {}) => new Vuex.Store({
  state: {
    search: searchState,
    i18n: {
      locale: 'en'
    }
  }
});

const i18n = {
  locale: 'en',
  messages: {
    en: {
      searchPlaceholder: 'What are you looking for?'
    }
  }
};

storiesOf('Search / Form', module)
  .add('With placeholder', () => ({
    components: { SearchForm },
    store,
    i18n,
    router,
    template: '<b-container class="mt-3"><SearchForm /></b-container>'
  }))
  .add('With query', () => ({
    components: { SearchForm },
    store: store({
      active: true,
      query: 'glacier'
    }),
    i18n,
    router,
    template: '<b-container class="mt-3"><SearchForm /></b-container>'
  }))
  .add('With pill & placeholder', () => ({
    components: { SearchForm },
    store: store({
      active: true,
      pill: 'Byzantine art'
    }),
    i18n,
    router,
    template: '<b-container class="mt-3"><SearchForm /></b-container>'
  }))
  .add('With pill & query', () => ({
    components: { SearchForm },
    store: store({
      active: true,
      pill: 'Byzantine art',
      query: 'wunderlich'
    }),
    i18n,
    router,
    template: '<b-container class="mt-3"><SearchForm /></b-container>'
  }))
  .add('With autocomplete', () => ({
    components: { SearchForm },
    store,
    i18n,
    router,
    template: '<b-container class="mt-3"><SearchForm :enableAutoSuggest="true" /></b-container>'
  }));
