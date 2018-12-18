import { storiesOf } from '@storybook/vue';

import CardSet from './CardSet.vue';
import cardData from '../_data/test-card-data.js';

storiesOf('CardSet', module)
  .add('as grid', () => ({
    components: { CardSet },
    template:  '<CardSet :cardData="cardData" class="grid width-fluid"/>',
    data() {
      return {
        cardData: cardData
      };
    }
  }))
  .add('as scrollable', () => ({
    components: { CardSet },
    template:  '<CardSet :cardData="cardData" class="grid single-row"/>',
    data() {
      return {
        cardData: cardData
      };
    }
  }));
