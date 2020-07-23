import { storiesOf } from '@storybook/vue';
import Vuex from 'vuex';
import SocialShareModal from './SocialShareModal.vue';
import ShareButton from './ShareButton.vue';

const i18n = {
  locale: 'en',
  messages: {
    en: {
      actions: {
        close: 'close',
        share: 'share',
        shareOn: 'Share on {social}'
      }
    }
  }
};

const store = new Vuex.Store({
  getters: {
    'http/canonicalUrl': () => {
      return 'https://www.example.org/';
    }
  }
});

storiesOf('Sharing', module)
  .add('Social share modal', () => ({
    components: {
      SocialShareModal,
      ShareButton
    },
    i18n,
    data() {
      return {
        mediaUrl: 'https://www.example.org/media'
      };
    },
    store,
    template: `
      <b-container class="mt-3 p-3 bg-white">
        <ShareButton />
        <SocialShareModal :media-url="mediaUrl" />
      </b-container>`
  }));
