import { storiesOf } from '@storybook/vue';

import SearchResultsList from './SearchResultsList.vue';

storiesOf('Search page', module)
  .add('List of search results', () => ({
    components: { SearchResultsList },
    data() {
      return { results: [
        {
          edmPreview: 'img/landscape.jpg',
          fields: [
            {
              title: 'Juozapas Kamarauskas. Vilniaus muitinės pastatas. 1920 | Juozapas Kamarauskas',
              description: 'Popierius, akvarelė, guašas, h/pl. - 16,5x22,7 cm'
            }]
        },
        {
          edmPreview: 'img/landscape.jpg',
          fields: [
            {
              title: 'Nežinomas Lietuvos XIX a. pr. dailininkas. Jaunos moters portretas. XIX a. pr. | Nežinomas Lietuvos XIX a. pr. dailininkas',
              description: 'Drobė, aliejus, h/pl. - 71x56 cm'
            }]
        },
        {
          edmPreview: 'img/portrait.jpg',
          fields: [
            {
              title: 'Juozapas Kamarauskas. Vilnelė. 1908 | Juozapas Kamarauskas',
              description: 'Popierius, akvarelė, h/pl. - 32,5x48,8 cm'
            }]
        },
        {
          edmPreview: 'img/landscape.jpg',
          fields: [
            {
              title: 'Antanas Jaroševičius. Beržai pakalnėje pavasarį. XX a. I p. | Antanas Jaroševičius',
              description: 'Popierius, akvarelė, h/pl. - 22,9x34,3 cm'
            }]
        }]
      };
    },
    template: ` <b-container
      class="mt-3"
      >
        <SearchResultsList :results="results" />
      </b-container>`
  }));
