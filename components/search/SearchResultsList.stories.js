import { storiesOf } from '@storybook/vue';

import SearchResultsList from './SearchResultsList.vue';

storiesOf('Search page', module)
  .add('List of search results', () => ({
    components: { SearchResultsList },
    data() {
      return { results: [
        {
          edmPreview: 'img/landscape.jpg',
          fields: {
            dcTitle: [
              'Juozapas Kamarauskas. Vilniaus muitinės pastatas. 1920 | Juozapas Kamarauskas'
            ],
            dcDescription: [
              'Popierius, akvarelė, guašas, h/pl. - 16,5x22,7 cm'
            ]
          }
        },
        {
          edmPreview: 'img/landscape.jpg',
          fields: {
            dcTitle: [
              'Akkor most repültem, vagy nem repültem?',
              'Naná, hogy regény'
            ],
            dcDescription: [
              'Drobė, aliejus, h/pl. - 71x56 cm'
            ]
          }
        },
        {
          edmPreview: 'img/portrait.jpg',
          fields: {
            dcTitle: [
              'Juozapas Kamarauskas. Vilnelė. 1908 | Juozapas Kamarauskas'
            ],
            dcDescription: [
              'Popierius, akvarelė, h/pl. - 32,5x48,8 cm'
            ]
          }
        },
        {
          edmPreview: 'img/landscape.jpg',
          fields: {
            dcTitle: 'Antanas Jaroševičius. Beržai pakalnėje pavasarį. XX a. I p. | Antanas Jaroševičius',
            dcDescription: [
              'Popierius, akvarelė, h/pl. - 22,9x34,3 cm'
            ]
          }
        }
      ] };
    },
    template: ` <b-container
      class="mt-3"
      >
        <SearchResultsList :results="results" />
      </b-container>`
  }));
