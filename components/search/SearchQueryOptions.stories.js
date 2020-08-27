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
      removeEntityFilter: 'Remove {entityLabel} filter'
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
          '/1': {
            es: 'Manuscrito'
          },
          '/2': {
            en: 'Human settlement'
          },
          '/3': {
            en: 'Food',
            ro: 'Mâncare'
          }
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
