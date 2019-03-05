import { storiesOf } from '@storybook/vue';

import AlertMessage from './AlertMessage.vue';

storiesOf('Generic', module)
  .add('Alert Message', () => ({
    components: { AlertMessage },
    template: ` <b-container
      class="mt-3"
      >
        <AlertMessage
          error="Invalid search query"
        />
      </b-container>`
  }));
