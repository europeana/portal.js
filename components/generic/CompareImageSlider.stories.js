import { storiesOf } from '@storybook/vue';

import CompareImageSlider from './CompareImageSlider.vue';

storiesOf('Generic', module)
  .add('Compare Image Slider', () => ({
    components: { CompareImageSlider },
    data() {
      return {
        imageLeft: 'https://www.fillmurray.com/640/360',
        imageRight: 'https://www.placecage.com/640/360'
      };
    },
    template: `
      <b-container class="mt-3">
        <CompareImageSlider
          :image-left="imageLeft"
          :image-right="imageRight"
        />
      </b-container>`
  }));
