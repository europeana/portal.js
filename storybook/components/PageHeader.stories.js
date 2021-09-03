import { storiesOf } from '@storybook/vue';
import Vuex from 'vuex';
import StoryRouter from 'storybook-vue-router';
import VueI18n from 'vue-i18n';
import PageHeader from '../../src/components/PageHeader.vue';

const i18n = new VueI18n();

const store = new Vuex.Store({
  state: {
    'link-group': {
      data: {
        mainNavigation: {
          links: [
            {
              text: 'Collections',
              url: '/'
            },
            {
              text: 'Teachers',
              url: '/'
            },
            {
              text: 'About us',
              url: '/'
            }
          ]
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
    i18n,
    store,
    components: { PageHeader },
    template: `
      <b-container class="mt-3">
        <PageHeader
          :on-collection-page="false"
          :enableSuggestionValidation="false"
          :enable-language-selector="false"
        />
      </b-container>
    `
  }));
