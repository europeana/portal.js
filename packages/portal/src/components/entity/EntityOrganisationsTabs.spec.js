import { createLocalVue, shallowMount } from '@vue/test-utils';

import EntityOrganisationsTabs from '@/components/entity/EntityOrganisationsTabs.vue';

const localVue = createLocalVue();

const factory = () => shallowMount(EntityOrganisationsTabs, {
  localVue,
  mocks: {
    $t: (val) => val,
    localePath: (path) => path
  },
  stubs: ['b-nav', 'b-nav-item']

});

describe('components/entity/EntityOrganisationsTabs', () => {
  describe('template', () => {
    it('renders two tabs, providing institutions, and aggregators', () => {
      const wrapper = factory();

      const tabs = wrapper.findAll('b-nav-item-stub');

      expect(tabs.length).toBe(2);
      expect(tabs.at(0).text()).toBe('organisations.providingInstitutions.title');
      expect(tabs.at(1).text()).toBe('organisations.aggregators.title');
    });
  });
});
