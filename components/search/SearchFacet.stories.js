import { storiesOf } from '@storybook/vue';

import SearchFacet from './SearchFacet.vue';

storiesOf('Search page', module)
  .add('Search facet', () => ({
    components: { SearchFacet },
    data() {
      return { name: 'TYPE', fields: { 'TEXT': 123456, 'VIDEO': 789, '3D': 10 }, selectedFields: ['VIDEO'] };
    },
    template: ` <b-container
      class="mt-3"
      >
        <b-row>
          <b-col cols="3">
            <SearchFacet :name="name" :fields="fields" :selected-fields="selectedFields" />
          </b-col>
        </b-row>
      </b-container>`
  }));
