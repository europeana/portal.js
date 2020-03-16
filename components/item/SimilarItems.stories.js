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

storiesOf('Record', module)
  .addDecorator(StoryRouter({}, {
    routes: [
      { name: 'item-all', path: '/item/*' }
    ]
  }))
  .add('Similar items', () => ({
    i18n,
    components: { SimilarItems },
    data() {
      return {
        items: [
          {
            europeanaId: '/123/abc',
            edmPreview: 'img/landscape.jpg',
            dcTitle: 'Woman Reading a letter'
          },
          {
            europeanaId: '/123/abc',
            edmPreview: 'img/portrait.jpg',
            dcTitle: 'View of house in Delft'
          },
          {
            europeanaId: '/123/abc',
            edmPreview: 'img/landscape.jpg',
            dcTitle: 'The Love Letter'
          },
          {
            europeanaId: '/123/abc',
            edmPreview: 'img/portrait.jpg',
            dcTitle: 'Dienstbode met een takshond in de'
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
