import Vuex from 'vuex';
import VueRouter from 'vue-router';
import { storiesOf } from '@storybook/vue';
import SearchQueryOptions from './SearchQueryOptions.vue';

const router = new VueRouter({
  routes: [
    {
      path: '/search',
      query: 'search'
    }
  ]
});

const store = new Vuex.Store({
  state: {
    i18n: {
      locale: 'en'
    }
  }
});

const i18n = {
  locale: 'en',
  messages: {
    en: {
      header: {
        searchFor: 'Search for {0}',
        searchForEverything: 'Search for everything'
      }
    }
  }
};

storiesOf('Search / Search Query Options', module)
  .add('Without suggestions', () => ({
    components: { SearchQueryOptions },
    store,
    i18n,
    router,
    template: '<b-container class="mt-3"><b-form-input ref="searchbox" /><SearchQueryOptions /></b-container>'
  }))
  .add('With suggestions', () => ({
    components: { SearchQueryOptions },
    data() {
      return {
        suggestions: {
          '/1': 'Manuscript',
          '/2': 'Human settlement',
          '/3': 'Food'
        }
      };
    },
    store,
    i18n,
    router,
    template: `
      <b-container class="mt-3">
        <b-form-input ref="searchbox" value="man" />
        <SearchQueryOptions v-model="suggestions" query="man" />
      </b-container>`
  }));
