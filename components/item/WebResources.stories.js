import { storiesOf } from '@storybook/vue';

import WebResources from './WebResources.vue';

storiesOf('Item page', module)
  .add('Web resources', () => ({
    components: { WebResources },
    data() {
      return { media: [
        {
          about: 'http://www.topfoto.co.uk/imageflows2/preview?EU017407',
          edmRights: {
            'def': [
              'http://rightsstatements.org/vocab/InC/1.0/'
            ]
          }
        },
        { about: 'http://www.topfoto.co.uk/imageflows/imagepreview/f=EU017407' }
      ] };
    },
    template: ` <b-container
      class="mt-3"
      >
        <WebResources
          :media="media"
        />
      </b-container>`
  }));
