import { storiesOf } from '@storybook/vue';

import BrowseCardText from './BrowseCardText.vue';

storiesOf('BrowseCardText', module)
  .add('texts', () => ({
    components: { BrowseCardText },
    template:  '<BrowseCardText linkText="This is the main description" :texts="texts" url="europeana.eu"/>',
    data(){
      return {
        texts: ['Jan', 'Feb', 'Mar']
      };
    }
  }));
