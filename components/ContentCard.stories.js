import { storiesOf } from '@storybook/vue';

import ContentCard from './ContentCard.vue';

storiesOf('ContentCard', module)
  .add('card', () => ({
    components: { ContentCard },
    template:  `<b-col cols="3">
  	<ContentCard 
        cardTitle="This is a Storybook Card"
        contentSource="card"
        imageUrl="https://api.europeana.eu/api/v2/thumbnail-by-url.json?size=w400&type=IMAGE&uri=http%3A%2F%2Fwww.epaveldas.lt%2FrecordObject%2FLDM%2F1_1013608" 
      />
    </b-col>`
  }));
