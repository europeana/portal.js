import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import MoreFiltersDropdownFacetOption from '@/components/search/MoreFiltersDropdownFacetOption.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = () => shallowMount(MoreFiltersDropdownFacetOption, {
  localVue,
  mocks: {
    $t: (key) => key
  },
  propsData: {
    facetName: 'LANGUAGE',
    option: 'de',
    index: 5
  }
});

describe('components/search/MoreFiltersDropdownFacetOption', () => {
  describe('forColourPalette', () => {
    it('is true for COLOURPALETTE facet', async() => {
      const wrapper = factory();

      await wrapper.setProps({
        facetName: 'COLOURPALETTE'
      });

      wrapper.vm.forColourPalette.should.be.true;
    });

    it('is false for other facets', () => {
      const wrapper = factory();

      wrapper.vm.forColourPalette.should.be.false;
    });
  });

  describe('fieldLabelId', () => {
    it('is derived from index and facet name', () => {
      const wrapper = factory();

      wrapper.vm.fieldLabelId.should.eq('facet-field-LANGUAGE-5');
    });
  });
});
