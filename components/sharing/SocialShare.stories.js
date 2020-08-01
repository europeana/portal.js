import { storiesOf } from '@storybook/vue';
import Vuex from 'vuex';
import VueI18n from 'vue-i18n';
import SocialShare from './SocialShare.vue';

const i18n = new VueI18n();

const store = new Vuex.Store({
  getters: {
    'http/canonicalUrl': () => {
      return 'https://www.example.org/';
    }
  }
});

storiesOf('Sharing', module)
  .add('Social share', () => ({
    components: { SocialShare },
    i18n,
    store,
    template: `
      <b-container class="mt-3">
        <SocialShare media-url="/" />
      </b-container>
    `
  }));
