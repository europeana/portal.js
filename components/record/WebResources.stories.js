import { storiesOf } from '@storybook/vue';

import WebResources from './WebResources.vue';

storiesOf('Record page', module)
  .add('WebResources', () => ({
    components: { WebResources },
    data() {
      return { media: [
        {
          rdfAbout: 'http://www.topfoto.co.uk/imageflows2/preview?EU017407',
          edmRights: {
            'def': [
              'http://rightsstatements.org/vocab/InC/1.0/'
            ]
          }
        },
        { rdfAbout: 'http://www.topfoto.co.uk/imageflows/imagepreview/f=EU017407' }
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
