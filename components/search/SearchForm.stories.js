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

SearchForm.methods.localePath = () => {};

storiesOf('Search page', module)
  .add('Search form', () => ({
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
  .add('Search form loading', () => ({
    components: { SearchForm },
    store,
    i18n,
    router,
    template: ` <b-container
      class="mt-3"
      >
        <SearchForm
          :is-loading="true"
        />
      </b-container>`
  }))
  .add('Search form with pill', () => ({
    components: { SearchForm },
    store: store('Johannes Vermeer'),
    i18n,
    router,
    template: ` <b-container
      class="mt-3"
      >
        <SearchForm
          :is-loading="true"
        />
      </b-container>`
  }));
