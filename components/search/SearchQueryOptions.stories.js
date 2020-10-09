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

const i18n = {
  locale: 'en',
  messages: {
    en: {
      searchFor: 'Search for {query}'
    }
  }
};

storiesOf('Search / Search Query Options', module)
  .add('With i18n', () => ({
    components: { SearchQueryOptions },
    i18n,
    router,
    data() {
      return {
        options: [
          {
            link: { path: '/en/search', query: { query: 'map' } },
            qa: 'highlighted query',
            i18n: {
              path: 'searchFor', slots: [
                { name: 'query', value: { text: 'map', highlight: true } }
              ]
            }
          }
        ]
      };
    },
    template: '<b-container class="mt-3"><b-form-input ref="searchbox" /><SearchQueryOptions v-model="options" /></b-container>'
  }))
  .add('With texts', () => ({
    components: { SearchQueryOptions },
    i18n,
    router,
    data() {
      return {
        options: [
          {
            link: { path: '/en/search', query: { query: '"Charles Dickens"' } },
            qa: 'texts link',
            texts: [
              { text: 'Charles ', highlight: false },
              { text: 'D', highlight: true },
              { text: 'ickens ', highlight: false }
            ]
          }
        ]
      };
    },
    template: '<b-container class="mt-3"><b-form-input ref="searchbox" /><SearchQueryOptions v-model="options" /></b-container>'
  }));
