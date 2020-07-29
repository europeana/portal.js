import { storiesOf } from '@storybook/vue';
import VueI18n from 'vue-i18n';
import AwesomeSwiper from './AwesomeSwiper.vue';

const i18n = new VueI18n();

storiesOf('Item page/Awesome Swiper', module)
  .add('Centered with multiple slides visible', () => ({
    i18n,
    components: { AwesomeSwiper },
    template: `
      <b-container class="mt-3">
        <AwesomeSwiper slides-per-view="2" />
      </b-container>
    `
  }))
  .add('Full height images', () => ({
    i18n,
    components: { AwesomeSwiper },
    template: `
      <b-container class="mt-3">
        <AwesomeSwiper slides-per-view="1" />
      </b-container>
    `
  }));
