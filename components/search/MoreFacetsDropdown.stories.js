import Vuex from 'vuex';
import VueRouter from 'vue-router';
import { storiesOf } from '@storybook/vue';
import MoreFacetsDropdown from './MoreFacetsDropdown.vue';

storiesOf('Search/MoreFacetsDropdown', module)
  .add('More Filters', () => ({
    components: { MoreFacetsDropdown },
     template: ` <b-container
      class="mt-3"
      >
        <MoreFacetsDropdown />
      </b-container>`
  }));
