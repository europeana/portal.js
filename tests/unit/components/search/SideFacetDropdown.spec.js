import sinon from 'sinon';
import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../../utils';

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

const storeDispatchStub = sinon.stub()
  .withArgs('search/queryFacets', { facet: 'COUNTRY' })
  .resolves([
    { name: 'COUNTRY', fields: countryFields }
  ]);

const factory = () => shallowMountNuxt(SideFacetDropdown, {
  localVue,
  mocks: {
    $fetchState: {},
    $t: (key) => key,
    $tFacetName: (key) => key,
    $store: {
      dispatch: storeDispatchStub
    }
  },
  stubs: ['b-button', 'b-form-checkbox', 'b-dropdown', 'b-dropdown-form'],
  propsData: {
    type: 'checkbox',
    name: 'COUNTRY'
  }
});

describe('components/search/SideFacetDropdown', () => {
  afterEach(() => {
    storeDispatchStub.resetHistory();
  });

  describe('fetch', () => {
    context('if dropdown is shown', () => {
      it('fetches facet', async() => {
        const wrapper = factory();
        await wrapper.setData({
          shown: true
        });

        await wrapper.vm.fetch();

        storeDispatchStub.should.have.been.calledWith('search/queryFacets', { facet: 'COUNTRY' });
      });

      it('marks facet as fetched', async() => {
        const wrapper = factory();
        await wrapper.setData({
          shown: true,
          fetched: false
        });

        await wrapper.vm.fetch();

        wrapper.vm.fetched.should.be.true;
      });
    });

    context('if dropdown is not shown', () => {
      it('does not fetch facet', async() => {
        const wrapper = factory();
        await wrapper.setData({
          shown: false
        });

        await wrapper.vm.fetch();

        storeDispatchStub.should.not.have.been.calledWith('search/queryFacets', { facet: 'COUNTRY' });
      });

      context('and facet name is "contentTier"', () => {
        it('does not fetch facet', async() => {
          const wrapper = factory();
          await wrapper.setProps({
            name: 'contentTier'
          });
          await wrapper.setData({
            shown: false
          });

          await wrapper.vm.fetch();

          storeDispatchStub.should.have.been.calledWith('search/queryFacets', { facet: 'contentTier' });
        });
      });
    });
  });

  it('puts selected options to the top list in descending count value order', async() => {
    const wrapper = factory();
    await wrapper.setProps({
      selected: ['Spain', 'United Kingdom']
    });
    await wrapper.setData({
      shown: true
    });
    await wrapper.vm.fetch();

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

  describe('methods', () => {
    describe('showDropdown', () => {
      it('marks dropdown as shown', async() => {
        const wrapper = factory();
        wrapper.vm['$fetch'] = sinon.spy();

        wrapper.vm.showDropdown();

        wrapper.vm.shown.should.be.true;
      });

      context('when facet is not fetched', () => {
        it('triggers fetch', async() => {
          const wrapper = factory();
          wrapper.vm['$fetch'] = sinon.spy();
          await wrapper.setData({
            fetched: false
          });

          wrapper.vm.showDropdown();

          wrapper.vm['$fetch'].should.have.been.called;
        });
      });

      context('when facet is already fetched', () => {
        it('does not trigger fetch', async() => {
          const wrapper = factory();
          wrapper.vm['$fetch'] = sinon.spy();
          await wrapper.setData({
            fetched: true
          });

          wrapper.vm.showDropdown();

          wrapper.vm['$fetch'].should.not.have.been.called;
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
});
