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
        share: 'share'
      }
    }
  }
};

const store = new Vuex.Store({
  getters: {
    'http/canonicalUrl': () => {}
  }
});

storiesOf('Generic', module)
  .add('Social share modal', () => ({
    components: {
      SocialShareModal,
      ShareButton
    },
    i18n,
    data() {
      return {
        url: 'https://www.europeana.eu/en/item/2021633/AtlantisPubliek_detail_aspx_xmldescid_176794805'
      };
    },
    store,
    template: `
      <b-container class="mt-3 p-3 bg-white">
        <ShareButton />
        <SocialShareModal url="url" />
      </b-container>`
  }));
