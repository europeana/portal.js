import { storiesOf } from '@storybook/vue';
import CompareImageSlider from './CompareImageSlider.vue';

const i18n = {
  locale: 'en',
  messages: {
    en: {
      directions: { right: 'foo', left: 'foo' }
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
        leftImageAttribute: {
          name: 'Name',
          creator: 'Creator',
          provider: 'Provider',
          rightsStatement: 'Rights statement',
          url: 'Url path'
        },
        rightImageAttribute: {
          name: 'Name',
          creator: 'Creator',
          provider: 'Provider',
          rightsStatement: 'Rights statement',
          url: 'Url path'
        }
      };
    },
    template: `
      <b-container class="mt-3">
        <CompareImageSlider
          :left-image-src="leftImageSrc"
          :right-image-src="rightImageSrc"
          :left-image-attribution="leftImageAttribute"
          :right-image-attribution="rightImageAttribute"
        />
      </b-container>`
  }));
