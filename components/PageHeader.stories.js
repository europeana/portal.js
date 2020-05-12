import { storiesOf } from '@storybook/vue';
import Vuex from 'vuex';
import StoryRouter from 'storybook-vue-router';
import VueI18n from 'vue-i18n';
import PageHeader from './PageHeader.vue';

const store = new Vuex.Store({
  state: {
    'link-group': {
      data: {
        mainNavigation: {
          link: ''
        }
      }
    },
    i18n: {
      locale: 'en'
    },
    search: {
      pill: ''
    }
  }
});

storiesOf('Design', module)
  .addDecorator(StoryRouter({}, {
    routes: [
      { query: '', path: '' }
    ]
  }))
  .add('Page Header', () => ({
    i18n: new VueI18n(),
    store,
    components: { PageHeader },
    template: `
      <b-container class="mt-3">
        <PageHeader
          :enableAutoSuggest="false"
          :enableSuggestionValidation="false"
          :enable-language-selector="false"
        />
      </b-container>
    `
  }));
