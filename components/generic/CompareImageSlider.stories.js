import { storiesOf } from '@storybook/vue';
import CompareImageSlider from './CompareImageSlider.vue';

const i18n = {
  locale: 'en',
  messages: {
    en: {
      'directions.right': 'foo'
    }
  }
};

storiesOf('Generic', module)
  .add('Compare Image Slider', () => ({
    components: { CompareImageSlider },
    i18n,
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
