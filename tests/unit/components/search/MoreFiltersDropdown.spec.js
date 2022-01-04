import { createLocalVue, shallowMount } from '@vue/test-utils';
import Vuex from 'vuex';
import sinon from 'sinon';
import MoreFiltersDropdown from '@/components/search/MoreFiltersDropdown';

const localVue = createLocalVue();
localVue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    search: {
      namespaced: true,
      state: {
        apiParams: {}
      },
      getters: {
        collection: () => null
      }
    }
  }
});

const factory = () => shallowMount(MoreFiltersDropdown, {
  localVue,
  propsData: {
    selected: {}
  },
  stubs: ['b-button', 'b-dropdown', 'b-dropdown-form'],
  mocks: {
    $t: (key) => key
  },
  store
});

describe('components/search/MoreFiltersDropdown', () => {
  it('displays the correct count of selected options', async() => {
    const wrapper = factory();

    await wrapper.setProps({
      selected: {
        'LANGUAGE': ['de', 'sv'],
        'PROVIDER': ['OpenUp!']
      }
    });

    expect(wrapper.vm.selectedOptionsCount).toEqual(3);
  });

  it('disables the apply button when nothing has been selected', async() => {
    const wrapper = factory();

    await wrapper.setData({
      preSelected: {}
    });

    await wrapper.setProps({
      selected: {}
    });

    expect(wrapper.vm.selectedOptionsUnchanged).toEqual(true);
  });

  it('disables the apply button when nothing new has been selected', async() => {
    const wrapper = factory();

    await wrapper.setData({
      preSelected: {}
    });

    await wrapper.setProps({
      selected: {
        'LANGUAGE': ['de', 'sv'],
        'PROVIDER': ['OpenUp!']
      }
    });

    expect(wrapper.vm.selectedOptionsUnchanged).toEqual(true);
  });

  it('enables the apply button when an option has been selected', async() => {
    const wrapper = factory();

    await wrapper.setProps({
      selected: {}
    });

    await wrapper.setData({
      preSelected: {
        'LANGUAGE': ['de', 'sv']
      }
    });

    expect(wrapper.vm.selectedOptionsUnchanged).toEqual(false);
  });

  it('maps an array of more facet names', async() => {
    const wrapper = factory();

    await wrapper.setProps({
      moreFacets: [
        {
          name: 'LANGUAGE',
          fields: [
            {
              count: 123,
              label: 'en'
            }
          ]
        },
        {
          name: 'PROVIDER',
          fields: [
            {
              count: 12,
              label: 'OpenUp'
            }
          ]
        }
      ]
    });

    expect(wrapper.vm.moreFacetNames).toEqual(['LANGUAGE', 'PROVIDER']);
  });

  it('clones selected data', async() => {
    const wrapper = factory();
    const selected = {
      'LANGUAGE': ['de', 'sv'],
      'PROVIDER': ['OpenUp!']
    };

    await wrapper.setProps({ selected });
    expect(wrapper.vm.preSelected).toEqual(selected);
  });

  it('clears preselected data when user clicks Cancel button', async() => {
    const wrapper = factory();
    wrapper.vm.$refs.dropdown.hide = sinon.spy();
    const cancelButton = wrapper.find('[data-qa="cancel button"]');

    await wrapper.setProps({
      selected: {
        'PROVIDER': ['OpenUp!']
      }
    });

    await wrapper.setData({
      preSelected: {
        'LANGUAGE': ['de', 'sv']
      }
    });

    cancelButton.vm.$emit('click');

    expect(wrapper.vm.preSelected).toEqual({ 'PROVIDER': ['OpenUp!'] });
  });

  it('clears all preselected data when user clicks the Reset Filter button', async() => {
    const wrapper = factory();

    await wrapper.setData({
      preSelected: {
        'LANGUAGE': ['de', 'sv']
      }
    });

    wrapper.vm.clearPreSelected();

    expect(wrapper.vm.preSelected).toEqual({ LANGUAGE: [] });
  });

  describe('dateFilterSelected()', () => {
    it('populates preSelected with `start` and `end` dates when user uses date filter', () => {
      const wrapper = factory();
      const facetName = 'proxy_dcterms_issued';
      const dateRange = { end: null, start: '2019-12-07' };

      wrapper.vm.dateFilterSelected(facetName, dateRange);

      expect(wrapper.vm.preSelected).toEqual({
        'proxy_dcterms_issued': ['[2019-12-07 TO *]']
      });
    });
  });

  describe('dateFilter computed property', () => {
    it('returns empty `end` and `start` properties when `proxy_dcterms_issued` doesn`t exist in preSelected', () => {
      const wrapper = factory();

      expect(wrapper.vm.dateFilter).toEqual({
        end: null,
        specific: false,
        start: null
      });
    });

    it('returns correct `end` and `start` properties if preSelected contains `proxy_dcterms_issued`', async() => {
      const wrapper = factory();

      await wrapper.setData({
        preSelected: {
          'proxy_dcterms_issued': ['[2019-12-06 TO *]']
        }
      });

      expect(wrapper.vm.dateFilter).toEqual({
        end: null,
        start: '2019-12-06'
      });
    });
  });

  describe('filtersChanged computed property', () => {
    const wrapper = factory();

    it('detects filters that have been added', async() => {
      await wrapper.setProps({
        selected: {
          'LANGUAGE': ['de']
        }
      });
      await wrapper.setData({
        preSelected: {
          'LANGUAGE': ['de', 'fr'],
          'IMAGE_SIZE': ['MEDIUM']
        }
      });

      expect(wrapper.vm.filtersChanged).toEqual(['LANGUAGE', 'IMAGE_SIZE']);
    });

    it('detects filters that have been removed', async() => {
      await wrapper.setProps({
        selected: {
          'LANGUAGE': ['de']
        }
      });
      await wrapper.setData({
        preSelected: {
          'LANGUAGE': []
        }
      });

      expect(wrapper.vm.filtersChanged).toEqual(['LANGUAGE']);
    });

    it('detects filters that are unchanged', async() => {
      await wrapper.setProps({
        selected: {
          'LANGUAGE': ['de']
        }
      });
      await wrapper.setData({
        preSelected: {
          'LANGUAGE': ['de'],
          'IMAGE_SIZE': []
        }
      });

      expect(wrapper.vm.filtersChanged).toEqual([]);
    });
  });
});
