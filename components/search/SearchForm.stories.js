import { storiesOf } from '@storybook/vue';

import SearchForm from './SearchForm.vue';

storiesOf('Search page', module)
  .add('Search form', () => ({
    components: { SearchForm },
    template: ` <b-container
      class="mt-3"
      >
        <SearchForm />
      </b-container>`
  }))
  .add('Search form loading', () => ({
    components: { SearchForm },
    template: ` <b-container
      class="mt-3"
      >
        <SearchForm
          :is-loading="true"
        />
      </b-container>`
  }));
