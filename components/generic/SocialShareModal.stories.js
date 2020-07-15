import { storiesOf } from '@storybook/vue';
import Vuex from 'vuex';
import VueI18n from 'vue-i18n';
import SocialShareModal from './SocialShareModal.vue';

const i18n = new VueI18n();

const store = new Vuex.Store({
  getters: {
    'http/canonicalUrl': () => {}
  }
});

storiesOf('Generic', module)
  .add('Social share modal', () => ({
    components: { SocialShareModal },
    i18n,
    data() {
      return {
        url: 'https://www.europeana.eu/en/item/2021633/AtlantisPubliek_detail_aspx_xmldescid_176794805'
      };
    },
    store,
    template: `
      <b-container class="mt-3">
        <b-button v-b-modal.shareModal variant="light">Share</b-button>
        <SocialShareModal id="shareModal" url="url" />
      </b-container>`
  }));
