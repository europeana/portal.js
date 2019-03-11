import { storiesOf } from '@storybook/vue';

import SearchFacets from './SearchFacets.vue';

storiesOf('Search page', module)
  .add('Search facets', () => ({
    components: { SearchFacets },
    data() {
      return { optionsType: { 'TEXT': 123456, 'IMAGE': 567, 'SOUND': 89 } };
    },
    template: ` <b-container
      class="mt-3"
      >
        <b-row>
          <b-col cols="3">
            <SearchFacets :optionsType="optionsType" />
          </b-col>
        </b-row>
      </b-container>`
  }));
