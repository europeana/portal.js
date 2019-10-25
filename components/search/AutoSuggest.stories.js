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

AutoSuggest.methods.localePath = () => {};

storiesOf('Auto Suggest', module)
  .add('Plain', () => ({
    components: { AutoSuggest },
    store,
    i18n,
    router,
    template: ` <b-container
      class="mt-3"
      >
        <AutoSuggest />
      </b-container>`
  }))
  .add('With pill', () => ({
    components: { AutoSuggest },
    store: store('Johannes Vermeer'),
    i18n,
    router,
    template: ` <b-container
      class="mt-3"
      >
        <AutoSuggest />
      </b-container>`
  }));
