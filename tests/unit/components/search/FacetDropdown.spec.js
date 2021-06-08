import { createLocalVue, shallowMount } from '@vue/test-utils';
import sinon from 'sinon';

import FacetDropdown from '../../../../src/components/search/FacetDropdown.vue';

const localVue = createLocalVue();

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

const factory = () => shallowMount(FacetDropdown, {
  localVue,
  mocks: {
    $t: (key) => key,
    $store: {
      dispatch: sinon.stub()
    }
  },
  stubs: ['b-button', 'b-form-checkbox', 'b-dropdown', 'b-dropdown-form'],
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

  describe('reset button', () => {
    context('when nothing has been selected', () => {
      it('is disabled', () => {
        const wrapper = factory();

        wrapper.setProps({
          selected: []
        });

        wrapper.setData({
          preSelected: []
        });

        const resetButton = wrapper.find('[data-qa="COUNTRY reset button"]');

        resetButton.attributes('disabled').should.eq('true');
      });

      context('when option has been selected', () => {
        it('is enabled', () => {
          const wrapper = factory();

          wrapper.setData({
            preSelected: ['Spain']
          });

          const resetButton = wrapper.find('[data-qa="COUNTRY reset button"]');

          (resetButton.attributes('disabled') === undefined).should.be.true;
        });
      });
    });
  });

  describe('apply button', () => {
    context('when new facet option has been selected', () => {
      it('is enabled', () => {
        const wrapper = factory();

        wrapper.setData({
          preSelected: ['Spain', 'United Kingdom']
        });

        const applyButton = wrapper.find('[data-qa="COUNTRY apply button"]');

        (applyButton.attributes('disabled') === undefined).should.be.true;
      });
    });

    context('when no new facet options have been selected', () => {
      it('is disabled', () => {
        const wrapper = factory();

        wrapper.setData({
          preSelected: []
        });

        const applyButton = wrapper.find('[data-qa="COUNTRY apply button"]');

        applyButton.attributes('disabled').should.eq('true');
      });
    });
  });

  describe('applySelection', () => {
    it('emits `updated` event', async() => {
      const wrapper = factory();

      wrapper.vm.$refs.dropdown.hide = sinon.spy();

      wrapper.vm.applySelection();
      wrapper.emitted()['changed'].length.should.equal(1);
    });
  });
});
