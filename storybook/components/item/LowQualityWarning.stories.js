import { storiesOf } from '@storybook/vue';
import InfoMessage from '../../../src/components/generic/InfoMessage.vue';
import '../../assets/scss/icons.scss';

storiesOf('Item page/Low Quality Warning', module)
  .add('Disabled', () => ({
    components: {
      InfoMessage
    },
    data() {
      return {
        lowQuality: true
      };
    },
    template: `
      <b-container class="mt-3">
        <InfoMessage
          v-if="lowQuality"
          message="Item was provided to us in low quality"
          variant="icon"
        />
      </b-container>`
  }));
