import { storiesOf } from '@storybook/vue';
import VueI18n from 'vue-i18n';

import ContentCard from './ContentCard.vue';

storiesOf('Design/Content cards', module)
  .add('Default card', () => ({
    i18n: new VueI18n(),
    components: { ContentCard },
    template: `<b-col cols="3" class="mt-3">
    	<ContentCard 
        title="This is a Storybook Card"
        contentSource="card"
        imageUrl="img/landscape.jpg" 
      />
    </b-col>`
  }))
  .add('Mini card', () => ({
    i18n: new VueI18n(),
    components: { ContentCard },
    template: `<b-col cols="3" class="mt-3">
    	<ContentCard 
        title="This is a Storybook Card"
        imageUrl="img/landscape.jpg" 
        variant="mini"
      />
    </b-col>`
  }));
