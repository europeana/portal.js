import { storiesOf } from '@storybook/vue';
import VueI18n from 'vue-i18n';
import AlertMessage from '../../../src/components/generic/AlertMessage.vue';

const i18n = new VueI18n();

storiesOf('Generic/Messages', module)
  .add('Alert', () => ({
    i18n,
    components: { AlertMessage },
    template: ` <b-container
      class="mt-3"
      >
        <AlertMessage
          error="Invalid search query"
        />
      </b-container>`
  }));
