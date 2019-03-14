import { storiesOf } from '@storybook/vue';

import PaginationNav from './PaginationNav.vue';

storiesOf('Generic', module)
  .add('Pagination', () => ({
    components: { PaginationNav },
    template: ` <b-container
      class="mt-3"
      >
        <PaginationNav :totalResults="56" />
        <PaginationNav :totalResults="6789" />
      </b-container>`
  }));
