import { createLocalVue, shallowMount } from '@vue/test-utils';
import sinon from 'sinon';

import SideFacetDropdown from '@/components/search/SideFacetDropdown.vue';

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

const factory = () => shallowMount(SideFacetDropdown, {
  localVue,
  mocks: {
    $t: (key) => key,
    $tFacetName: (key) => key,
    $store: {
      dispatch: sinon.stub(),
      state: {
        search: {
          facets: [
            { name: 'COUNTRY', fields: countryFields }
          ]
        }
      }
    }
  },
  stubs: ['b-button', 'b-form-checkbox', 'b-dropdown', 'b-dropdown-form'],
  propsData: {
    type: 'checkbox',
    name: 'COUNTRY'
  }
});

describe('components/search/SideFacetDropdown', () => {
  it('puts selected options to the top list in descending count value order', async() => {
    const wrapper = factory();

    await wrapper.setProps({
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

  describe('apply button', () => {
    context('when new facet option has been selected', () => {
      it('is enabled', async() => {
        const wrapper = factory();

        await wrapper.setData({
          preSelected: ['Spain', 'United Kingdom']
        });

        const applyButton = wrapper.find('[data-qa="COUNTRY apply button"]');

        (applyButton.attributes('disabled') === undefined).should.be.true;
      });
    });

    context('when no new facet options have been selected', () => {
      it('is disabled', async() => {
        const wrapper = factory();

        await wrapper.setData({
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
