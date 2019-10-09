import { storiesOf } from '@storybook/vue';

import CompareImageSlider from './CompareImageSlider.vue';

storiesOf('Generic', module)
  .add('Compare Image Slider', () => ({
    components: { CompareImageSlider },
    data() {
      return {
        imageLeft: 'img/landscape.jpg',
        imageRight: 'img/landscape-monochrome.jpg'
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
