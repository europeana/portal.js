import { storiesOf } from '@storybook/vue';
import VueI18n from 'vue-i18n';
import SetForm from './SetForm';

import messages from '../../lang/en';

const i18n = new VueI18n({
  locale: 'en',
  messages: {
    en: messages
  }
});

// TODO: need to go into modal to show design
storiesOf('Set/SetForm', module)
  .add('Create set', () => ({
    i18n,
    components: { SetForm },
    template: ` <b-container
      class="mt-3"
      >
        <SetForm />
      </b-container>`
  }))
  .add('Edit set', () => ({
    i18n,
    components: { SetForm },
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
        <SetForm
          :id="id"
          :title="title"
          :description="description"
        />
      </b-container>`
  }));
