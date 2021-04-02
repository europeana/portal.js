import { storiesOf } from '@storybook/vue';
import VueI18n from 'vue-i18n';
import SetFormModal from './SetFormModal';

import messages from '../../lang/en';

const i18n = new VueI18n({
  locale: 'en',
  messages: {
    en: messages
  }
});

// TODO: need to go into modal to show design
storiesOf('Collection/Form (modal)', module)
  .add('Create', () => ({
    i18n,
    components: { SetFormModal },
    template: ` <b-container
      class="mt-3"
      >
        <b-button v-b-modal.set-form-modal>{{ $t('set.actions.createNew') }}</b-button>
        <SetFormModal />
      </b-container>`
  }))
  .add('Edit', () => ({
    i18n,
    components: { SetFormModal },
    data() {
      return {
        id: 'http://data.europeana.eu/set/1',
        title: {
          en: 'Mountain scenery'
        },
        description: {
          en: 'Explore this gallery of paintings, drawings and photography of mountains and highlands across Europe.'
        }
      };
    },
    template: ` <b-container
      class="mt-3"
      >
        <b-button v-b-modal.set-form-modal>{{ $t('set.actions.edit') }}</b-button>
        <SetFormModal
          :set-id="id"
          :title="title"
          :description="description"
        />
      </b-container>`
  }));
