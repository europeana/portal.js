import { storiesOf } from '@storybook/vue';

import SearchSelectedFacets from './SearchSelectedFacets.vue';

storiesOf('Search page', module)
  .add('Search selected facets', () => ({
    components: { SearchSelectedFacets },
    data() {
      return { selected: ['Image', 'Video', 'PDF'] };
    },
    template: ` <b-container
      class="mt-3"
      >
        <SearchSelectedFacets :selected="selected"/>
      </b-container>`
  }));
