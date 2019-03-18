import { storiesOf } from '@storybook/vue';

import SearchFacets from './SearchFacets.vue';

storiesOf('Search page', module)
  .add('Search facets', () => ({
    components: { SearchFacets },
    data() {
      return { options: { 'TYPE': { 'TEXT': 123456, 'VIDEO': 789, '3D': 10 } } };
    },
    template: ` <b-container
      class="mt-3"
      >
        <b-row>
          <b-col cols="3">
            <SearchFacets :options="options" />
          </b-col>
        </b-row>
      </b-container>`
  }));
