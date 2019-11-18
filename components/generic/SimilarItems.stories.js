import { storiesOf } from '@storybook/vue';
import StoryRouter from 'storybook-vue-router';
import SimilarItems from './SimilarItems.vue';

const i18n = {
  locale: 'en',
  messages: {
    en: {
      formatting: {
        ellipsis: '…'
      }
    }
  }
};

storiesOf('Generic', module)
  .addDecorator(StoryRouter({}, {
    routes: [
      { name: 'record-all', path: '/record/*' }
    ]
  }))
  .add('Similar items', () => ({
    i18n,
    components: { SimilarItems },
    data() {
      return {
        items: [
          {
            identifier: '/123/abc',
            thumbnail: 'img/landscape.jpg',
            title: 'Woman Reading a letter'
          },
          {
            identifier: '/123/abc',
            thumbnail: 'img/portrait.jpg',
            title: 'View of house in Delt'
          },
          {
            identifier: '/123/abc',
            thumbnail: 'img/landscape.jpg',
            title: 'The Love Letter'
          },
          {
            identifier: '/123/abc',
            thumbnail: 'img/portrait.jpg',
            title: 'Dienstbode met een takshond in de'
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
