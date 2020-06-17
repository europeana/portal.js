import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import Vuex from 'vuex';

import RelatedCollections from '../../../../components/generic/RelatedCollections.vue';
import apiConfig from '../../../../modules/apis/defaults';

const localVue = createLocalVue();
localVue.use(BootstrapVue);
localVue.use(Vuex);

const store = new Vuex.Store({
  getters: {
    'apis/config': () => apiConfig
  }
});

const factory = () => shallowMount(RelatedCollections, {
  localVue,
  store,
  propsData: {
    query: 'Art'
  },
  stubs: ['b-container'],
  mocks: {
    $i18n: { locale: 'en' },
    $t: () => {},
    $route: { query: {} },
    $fetch: () => {}
  }
});

// const relatedChips = [
//   {
//     id: 'http://data.europeana.eu/concept/base/190',
//     prefLabel: {
//       en: 'Art'
//     }
//   },
//   {
//     id: 'http://data.europeana.eu/concept/base/194',
//     prefLabel: {
//       en: 'Visual arts'
//     }
//   },
//   {
//     id: 'http://data.europeana.eu/concept/base/96',
//     prefLabel: {
//       en: 'Art Nouveau'
//     }
//   },
//   {
//     id: 'http://data.europeana.eu/concept/base/207',
//     prefLabel: {
//       en: 'Byzantine art'
//     }
//   }
// ];

describe('components/generic/RelatedCollections', () => {
  it('shows a section with related collections chips', async() => {
    const wrapper = factory();
    wrapper.setProps({ query: 'Art' });
    console.log(wrapper.html());
    // wrapper.vm.getSearchSuggestions('Art');
    await wrapper.vm.$nextTick();
    // console.log(wrapper.html());
    const relatedCollections = wrapper.find('[data-qa="related collections"]');
    // console.log(relatedCollections.attributes());
    relatedCollections.isVisible().should.be.true;
  });
});
