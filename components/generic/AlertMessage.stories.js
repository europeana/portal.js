import { storiesOf } from '@storybook/vue';
import VueI18n from 'vue-i18n';

import AlertMessage from './AlertMessage.vue';

storiesOf('Generic', module)
  .add('Alert message', () => ({
    i18n: new VueI18n(),
    components: { AlertMessage },
    template: ` <b-container
      class="mt-3"
      >
        <AlertMessage
          error="Invalid search query"
        />
      </b-container>`
  }));
