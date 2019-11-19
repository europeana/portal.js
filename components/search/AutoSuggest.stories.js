import Vuex from 'vuex';
import VueRouter from 'vue-router';
import { storiesOf } from '@storybook/vue';
import AutoSuggest from './AutoSuggest.vue';

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

storiesOf('Search / Auto suggest', module)
  .add('Without suggestions', () => ({
    components: { AutoSuggest },
    store,
    i18n,
    router,
    template: '<b-container class="mt-3"><b-form-input ref="searchbox" /><AutoSuggest /></b-container>'
  }))
  .add('With suggestions', () => ({
    components: { AutoSuggest },
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
        <AutoSuggest v-model="suggestions" query="man" />
      </b-container>`
  }));
