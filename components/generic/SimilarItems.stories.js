import { storiesOf } from '@storybook/vue';
import StoryRouter from 'storybook-vue-router';
import SimilarItems from './SimilarItems.vue';

const i18n = {
  locale: 'en',
  messages: {
    en: {}
  }
};

storiesOf('Generic', module)
  .addDecorator(StoryRouter())
  .add('Similar items', () => ({
    i18n,
    components: { SimilarItems },
    data() {
      return {
        items: [
          {
            identifier: 'en/entity/person/60404-johannes-vermeer',
            thumbnail: 'https://www.placecage.com/200/200',
            name: 'Woman Reading a letter'
          },
          {
            identifier: 'en/entity/person/60404-johannes-vermeer',
            thumbnail: 'https://www.fillmurray.com/200/200',
            name: 'View of house in Delt'
          },
          {
            identifier: 'en/entity/person/60404-johannes-vermeer',
            thumbnail: 'https://www.placecage.com/200/200',
            name: 'The Love Letter'
          },
          {
            identifier: 'en/entity/person/60404-johannes-vermeer',
            thumbnail: 'https://www.fillmurray.com/200/200',
            name: 'Dienstbode met een takshond in de'
          }
        ]
      };
    },
    template: ` <b-container
      class="mt-3"
      >
        <SimilarItems :items="items"/>
      </b-container>`
  }));
