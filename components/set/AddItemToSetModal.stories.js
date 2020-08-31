// FIXME: `fetchCollections` uses $auth; how to mock that?

import { storiesOf } from '@storybook/vue';
import VueI18n from 'vue-i18n';
import AddItemToSetModal from './AddItemToSetModal';

import messages from '../../lang/en';

const i18n = new VueI18n({
  locale: 'en',
  messages: {
    en: messages
  }
});

storiesOf('Collection/Add item to collection (modal)', module)
  .add('Modal', () => ({
    i18n,
    components: { AddItemToSetModal },
    data() {
      return {
        collections: [
          { name: 'My first collection (private)', count: 12 },
          { name: 'Beautiful flowers (private)', count: 16 }
        ]
      };
    },
    template: `<b-container
      class="mt-3"
      >
        <b-button v-b-modal.add-item-to-set-modal>{{ $t('set.actions.addTo') }}</b-button>
        <AddItemToSetModal
          item-id="/123/abc"
        />
      </b-container>`
  }));
