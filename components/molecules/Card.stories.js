import { storiesOf } from '@storybook/vue';

import Card from './Card.vue';
import cardData from '../_data/test-card-data.js';

const style = 'style="height: 300px; width: 300px;"';

storiesOf('Card', module)
  .add('singular', () => ({
    components: { Card },
    template:  '<Card :linkText="linkText" :texts="texts" :thumbnail="thumbnail" :url="url" ' + style + '/>',
    data(){
      return cardData[0];
    }
  }));
