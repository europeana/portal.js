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
    type: 'checkbox',
    fields: countryFields,
    selected: ['United Kingdom']
  }
});

describe('components/search/FacetDropdown', () => {
  it('puts selected options to the top list in descending count value order', () => {
    const wrapper = factory();

    wrapper.setProps({
      selected: ['Spain', 'United Kingdom']
    });
    wrapper.vm.sortOptions.should.eql([
      {
        count: 99,
        label: 'United Kingdom'
      },
      {
        count: 44,
        label: 'Spain'
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

  it('sets `activateCheckboxResetButton` property to be false if nothing has been pre selected', () => {
    const wrapper = factory();

    wrapper.setData({
      preSelected: []
    });
    wrapper.vm.activateCheckboxResetButton.should.eq(false);
  });

  it('sets `activateCheckboxResetButton` property to be true if option has been pre selected', () => {
    const wrapper = factory();

    wrapper.setData({
      preSelected: ['Spain']
    });
    wrapper.vm.activateCheckboxResetButton.should.eq(true);
  });

  it('sets `disableApplyButton` property to be false if preselected options length dont match selected facets', () => {
    const wrapper = factory();

    wrapper.setData({
      preSelected: ['Spain', 'United Kingdom']
    });
    wrapper.vm.disableApplyButton.should.eq(false);
  });

  it('sets `disableApplyButton` property to be false if preselected options dont match selected facets', () => {
    const wrapper = factory();

    wrapper.setData({
      preSelected: ['United Kingdom']
    });
    wrapper.vm.disableApplyButton.should.eq(true);
  });

  it('emits `updated` event when applySelection method is called', async() => {
    const wrapper = factory();

    wrapper.vm.applySelection();
    wrapper.emitted()['updated'].length.should.equal(1);
  });
});
