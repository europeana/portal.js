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

const store = (pillLabel) => new Vuex.Store({
  state: {
    search: {
      pill: pillLabel
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

storiesOf('Search/Form', module)
  .add('Plain', () => ({
    components: { SearchForm },
    store,
    i18n,
    router,
    template: ` <b-container
      class="mt-3"
      >
        <SearchForm />
      </b-container>`
  }))
  .add('With pill', () => ({
    components: { SearchForm },
    store: store('Johannes Vermeer'),
    i18n,
    router,
    template: ` <b-container
      class="mt-3"
      >
        <SearchForm />
      </b-container>`
  }));
