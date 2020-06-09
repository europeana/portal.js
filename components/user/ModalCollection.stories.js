import { storiesOf } from '@storybook/vue';
import VueI18n from 'vue-i18n';
import ModalCollection from './ModalCollection.vue';

const i18n = new VueI18n();

storiesOf('User/Collection', module)
  .add('Modal', () => ({
    i18n,
    components: { ModalCollection },
    template: ` <b-container
      class="mt-3"
      >
        <b-button @click="$bvModal.show('modal-collection')">Add to collection</b-button>
        <ModalCollection />
      </b-container>`
  }));
