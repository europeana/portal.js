import { createLocalVue, mount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import MoreFacetsDropdown from '../../../../components/search/MoreFacetsDropdown.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = () => mount(MoreFacetsDropdown, {
  localVue,
  propsData: {
    selected: {}
  },
  mocks: {
    $t: (key) => key,
    $tc: (key) => key
  }
});

describe('components/search/MoreFacetsDropdown', () => {
  it('displays the correct count of selected options', () => {
    const wrapper = factory();

    wrapper.setProps({
      selected: {
        LANGUAGE: ['de', 'sv'],
        PROVIDER: ['OpenUp!']
      }
    });

    wrapper.vm.selectedOptionsCount.should.eql(3);
  });

  it('disables the cancel and apply button when nothing has been selected', () => {
    const wrapper = factory();

    wrapper.setProps({
      selected: {}
    });

    wrapper.setData({
      preSelected: {}
    });

    wrapper.vm.selectedOptionsUnchanged.should.eql(true);
  });

  it('disables the cancel and apply button when nothing new has been selected', () => {
    const wrapper = factory();

    wrapper.setProps({
      selected: {
        LANGUAGE: ['de', 'sv'],
        PROVIDER: ['OpenUp!']
      }
    });

    wrapper.setData({
      preSelected: {}
    });

    wrapper.vm.selectedOptionsUnchanged.should.eql(true);
  });

  it('enables the cancel and apply button when an option has been selected', () => {
    const wrapper = factory();

    wrapper.setProps({
      selected: {}
    });

    wrapper.setData({
      preSelected: {
        LANGUAGE: ['de', 'sv']
      }
    });

    wrapper.vm.selectedOptionsUnchanged.should.eql(false);
  });

  it('maps an array of more facet names', () => {
    const wrapper = factory();

    wrapper.setProps({
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

    wrapper.vm.moreFacetNames.should.eql([ 'LANGUAGE', 'PROVIDER' ]);

  });

  it('clones selected data', () => {
    const wrapper = factory();
    const selected = {
      LANGUAGE: ['de', 'sv'],
      PROVIDER: ['OpenUp!']
    };

    wrapper.setProps({ selected });
    wrapper.vm.preSelected.should.eql(selected);
  });

  it('clears preselected data when user clicks Cancel button', () => {
    const wrapper = factory();
    const cancelButton = wrapper.find('[data-qa="cancel button"]');

    wrapper.setProps({
      selected: {
        PROVIDER: ['OpenUp!']
      }
    });

    wrapper.setData({
      preSelected: {
        LANGUAGE: ['de', 'sv']
      }
    });

    cancelButton.trigger('click');

    wrapper.vm.preSelected.should.eql({ 'PROVIDER': ['OpenUp!'] });
  });

  it('clears all preselected data when user clicks the Reset Filter button', () => {
    const wrapper = factory();

    wrapper.setData({
      preSelected: {
        LANGUAGE: ['de', 'sv']
      }
    });

    wrapper.vm.clearPreSelected();


    wrapper.vm.preSelected.should.eql({ LANGUAGE: [] });
  });
});
