import { storiesOf } from '@storybook/vue';
import CompareImageSlider from './CompareImageSlider.vue';

const i18n = {
  locale: 'en',
  messages: {
    en: {
      directions: { right: 'Right', left: 'Left' }
    }
  }
};

storiesOf('Generic', module)
  .add('Compare Image Slider', () => ({
    components: { CompareImageSlider },
    i18n,
    data() {
      return {
        leftImageSrc: 'img/landscape.jpg',
        rightImageSrc: 'img/landscape-monochrome.jpg',
        leftImageAttribution: {
          name: 'Name',
          creator: 'Creator',
          provider: 'Provider',
          rightsStatement: 'http://creativecommons.org/licenses/by-nd/4.0/',
          url: 'https://www.example.org/left'
        },
        rightImageAttribution: {
          name: 'Name',
          creator: 'Creator',
          provider: 'Provider',
          rightsStatement: 'http://creativecommons.org/publicdomain/mark/1.0/',
          url: 'https://www.example.org/right'
        }
      };
    },
    template: `
      <b-container class="mt-3">
        <CompareImageSlider
          :left-image-src="leftImageSrc"
          :right-image-src="rightImageSrc"
          :left-image-attribution="leftImageAttribution"
          :right-image-attribution="rightImageAttribution"
        />
      </b-container>`
  }));
