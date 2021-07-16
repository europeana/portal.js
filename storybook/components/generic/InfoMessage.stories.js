import { storiesOf } from '@storybook/vue';

import InfoMessage from '../../../src/components/generic/InfoMessage.vue';

storiesOf('Generic', module)
  .add('Info message', () => ({
    components: { InfoMessage },
    template: ` <b-container
      class="mt-3"
      >
        <InfoMessage
          message="This section only exists to inform you of something."
        />
      </b-container>`
  }));
