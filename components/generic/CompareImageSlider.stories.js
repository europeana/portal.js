import { storiesOf } from '@storybook/vue';

import CompareImageSlider from './CompareImageSlider.vue';

storiesOf('Generic', module)
  .add('Compare Image Slider', () => ({
    components: { CompareImageSlider },
    template: ` <b-container
      class="mt-3"
      >
        <CompareImageSlider />
      </b-container>`
  }));
