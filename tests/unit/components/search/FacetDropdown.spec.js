import { createLocalVue, mount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import FacetDropdown from '../../../../components/search/FacetDropdown.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const countryFields = [
  {
    count: 100,
    label: 'Germany'
  },
  {
    count: 101,
    label: 'Netherlands'
  },
  {
    count: 99,
    label: 'United Kingdom'
  },
  {
    count: 44,
    label: 'Spain'
  }
];

const factory = () => mount(FacetDropdown, {
  localVue,
  mocks: {
    $t: (key) => key
  },
  propsData: {
    facetType: 'checkbox',
    facet: {
      fields: countryFields
    },
    selectedFacet: ['United Kingdom']
  }
});

describe('components/search/FacetDropdown', () => {
  it('puts selected options to the top of the list', () => {
    const wrapper = factory();

    wrapper.setData({
      selected: ['Spain', 'United Kingdom']
    });
    wrapper.vm.sortOptions.should.eql([
      {
        count: 44,
        label: 'Spain'
      },
      {
        count: 99,
        label: 'United Kingdom'
      },
      {
        count: 100,
        label: 'Germany'
      },
      {
        count: 101,
        label: 'Netherlands'
      }
    ]);
  });

  it('sets `activateResetButton` property to be false if nothing has been pre selected', () => {
    const wrapper = factory();

    wrapper.setData({
      preSelected: []
    });
    wrapper.vm.activateResetButton.should.eq(false);
  });

  it('sets `activateResetButton` property to be true if option has been pre selected', () => {
    const wrapper = factory();

    wrapper.setData({
      preSelected: ['Spain']
    });
    wrapper.vm.activateResetButton.should.eq(true);
  });

  it('sets `activateApplyButton` property to be false if preselected options length dont match selected facets', () => {
    const wrapper = factory();

    wrapper.setData({
      preSelected: ['Spain', 'United Kingdom']
    });
    wrapper.vm.activateApplyButton.should.eq(false);
  });

  it('sets `activateApplyButton` property to be false if preselected options dont match selected facets', () => {
    const wrapper = factory();

    wrapper.setData({
      preSelected: ['United Kingdom']
    });
    wrapper.vm.activateApplyButton.should.eq(true);
  });

  it('emits `updated` event when applySelection method is called', async() => {
    const wrapper = factory();

    wrapper.vm.applySelection();
    wrapper.emitted()['updated'].length.should.equal(1);
  });

  it('emits `updated` event when aapplyRadioSelection method is called', async() => {
    const wrapper = factory();

    wrapper.vm.applyRadioSelection();
    wrapper.emitted()['updated'].length.should.equal(1);
  });
});
