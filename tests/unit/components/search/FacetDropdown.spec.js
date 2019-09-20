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
    name: 'COUNTRY'
  }
});

describe('components/search/FacetDropdown', () => {
  it('puts selected options to the top list in descending count value order', () => {
    const wrapper = factory();

    wrapper.setProps({
      selected: ['Spain', 'United Kingdom']
    });

    wrapper.vm.sortedOptions.should.eql([
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

  it('sets Reset button to disabled if nothing has been selected', () => {
    const wrapper = factory();

    wrapper.setProps({
      selected: []
    });

    wrapper.setData({
      preSelected: []
    });

    const countryResetButtonDisabled = wrapper.find('[data-qa="COUNTRY reset button"][disabled="disabled"]');

    countryResetButtonDisabled.exists().should.eq(true);
  });

  it('sets Reset button to be enabled if option has been selected', () => {
    const wrapper = factory();

    wrapper.setData({
      preSelected: ['Spain']
    });

    const countryResetButtonDisabled = wrapper.find('[data-qa="COUNTRY reset button"][disabled="disabled"]');

    countryResetButtonDisabled.exists().should.eq(false);
  });

  it('sets Apply button to enabled if new facet option has been selected', () => {
    const wrapper = factory();

    wrapper.setData({
      preSelected: ['Spain', 'United Kingdom']
    });

    const countryApplyButtonDisabled = wrapper.find('[data-qa="COUNTRY apply button"][disabled="disabled"]');

    countryApplyButtonDisabled.exists().should.eq(false);
  });

  it('sets Apply button to be disabled if no new facet options have been selected', () => {
    const wrapper = factory();

    wrapper.setData({
      preSelected: []
    });

    const countryApplyButtonDisabled = wrapper.find('[data-qa="COUNTRY apply button"][disabled="disabled"]');

    countryApplyButtonDisabled.exists().should.eq(true);
  });


  it('emits `updated` event when applySelection method is called', async() => {
    const wrapper = factory();

    wrapper.vm.applySelection();
    wrapper.emitted()['changed'].length.should.equal(1);
  });
});
