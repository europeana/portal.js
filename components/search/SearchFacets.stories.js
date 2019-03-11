import { storiesOf } from '@storybook/vue';

import SearchFacets from './SearchFacets.vue';

storiesOf('Search page', module)
  .add('Search facets', () => ({
    components: { SearchFacets },
    template: ` <b-container
      class="mt-3"
      >
        <b-row>
          <b-col cols="3">
            <SearchFacets />
          </b-col>
        </b-row>
      </b-container>`
  }));
