import { storiesOf } from '@storybook/vue';

import SearchBarPill from './SearchBarPill.vue';

storiesOf('Search page', module)
  .add('Search bar pill', () => ({
    components: { SearchBarPill },
    template: ` <b-container
      class="mt-3"
      >
        <SearchBarPill text="This is a pill" :removeLinkTo="{}"/>
        <SearchBarPill text="This is a pill trunacted" :removeLinkTo="{}"/>
      </b-container>`
  }));
