import { storiesOf } from '@storybook/vue';

import SearchForm from './SearchForm.vue';

storiesOf('Search page', module)
  .add('SearchForm', () => ({
    components: { SearchForm },
    template: ` <b-container
      class="mt-3"
      >
        <SearchForm />
      </b-container>`
  }))
  .add('SearchForm loading', () => ({
    components: { SearchForm },
    template: ` <b-container
      class="mt-3"
      >
        <SearchForm
          :is-loading="true"
        />
      </b-container>`
  }));
