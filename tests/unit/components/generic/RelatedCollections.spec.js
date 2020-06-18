import { createLocalVue, mount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import Vuex from 'vuex';

import RelatedCollections from '../../../../components/generic/RelatedCollections.vue';
import apiConfig from '../../../../modules/apis/defaults';

const localVue = createLocalVue();
localVue.use(BootstrapVue);
localVue.use(Vuex);

const factory = (options = {}) => {
  return mount(RelatedCollections, {
    localVue,
    propsData: {
      query: 'Art'
    },
    stubs: ['b-container'],
    mocks: {
      ...{
        $i18n: { locale: 'en' },
        $t: () => {},
        $fetch: () => {}
      }, ...(options.mocks || {})
    },
    store: options.store || store()
  });
};
const getters = {
  'apis/config': () => apiConfig
};
const store = (options = {}) => {
  return new Vuex.Store({
    getters,
    state: options.state || {
      i18n: {
        locale: 'en'
      }
    }
  });
};

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
    await wrapper.vm.$nextTick();
    const relatedCollections = wrapper.find('[data-qa="related collections"]');
    relatedCollections.isVisible().should.be.true;
  });
});
