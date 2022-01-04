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
    $route: {
      query: {}
    },
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
    describe('if fields are not static', () => {
      it('fetches facet', async() => {
        const wrapper = factory();
        await wrapper.setProps({
          staticFields: null
        });

        await wrapper.vm.fetch();

        expect(storeDispatchStub.calledWith('search/queryFacets', { facet: 'COUNTRY' }));
      });

      it('marks facet as fetched', async() => {
        const wrapper = factory();
        await wrapper.setProps({
          staticFields: null
        });
        await wrapper.setData({
          fetched: false
        });

        await wrapper.vm.fetch();

        expect(wrapper.vm.fetched);
      });
    });

    describe('if fields are static', () => {
      it('does not fetch facet', async() => {
        const wrapper = factory();
        await wrapper.setProps({
          name: 'collection',
          staticFields: []
        });

        await wrapper.vm.fetch();

        expect(storeDispatchStub.calledWith('search/queryFacets', { facet: 'collection' })).toBe(false);
      });

      it('marks facet as fetched', async() => {
        const wrapper = factory();
        await wrapper.setProps({
          name: 'collection',
          staticFields: []
        });

        await wrapper.vm.fetch();

        expect(wrapper.vm.fetched);
      });
    });
  });

  it('puts selected options to the top list in descending count value order', async() => {
    const wrapper = factory();
    await wrapper.setProps({
      selected: ['Spain', 'United Kingdom']
    });
    await wrapper.vm.fetch();

    expect(wrapper.vm.sortedOptions).toEqual([
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

  describe('methods', () => {
    describe('updateRouteQueryReusability', () => {
      describe('when this is not the reusability facet', () => {
        it('triggers fetch', async() => {
          const wrapper = factory();
          wrapper.vm.$fetch = sinon.spy();
          await wrapper.setProps({
            name: 'TYPE'
          });

          wrapper.vm.updateRouteQueryReusability();

          expect(wrapper.vm.$fetch.called);
        });
      });

      describe('when this is the reusability facet', () => {
        it('does not trigger fetch', async() => {
          const wrapper = factory();
          wrapper.vm.$fetch = sinon.spy();
          await wrapper.setProps({
            name: 'REUSABILITY'
          });

          wrapper.vm.updateRouteQueryReusability();

          expect(wrapper.vm.$fetch.called).toBe(false);
        });
      });
    });

    describe('updateRouteQueryQf', () => {
      describe('when qf changed for other facets', () => {
        it('triggers fetch', async() => {
          const wrapper = factory();
          wrapper.vm.$fetch = sinon.spy();
          await wrapper.setProps({
            name: 'TYPE'
          });

          const oldQf = ['TYPE:"IMAGE"'];
          const newQf = ['TYPE:"IMAGE"', 'COUNTRY:"France"'];

          wrapper.vm.updateRouteQueryQf(newQf, oldQf);

          expect(wrapper.vm.$fetch.called);
        });
      });

      describe('when qf changed only for this facet', () => {
        it('does not trigger fetch', async() => {
          const wrapper = factory();
          wrapper.vm.$fetch = sinon.spy();
          await wrapper.setProps({
            name: 'TYPE'
          });

          const oldQf = ['TYPE:"IMAGE"'];
          const newQf = ['TYPE:"IMAGE"', 'TYPE:"TEXT"'];

          wrapper.vm.updateRouteQueryQf(newQf, oldQf);

          expect(wrapper.vm.$fetch.called).toBe(false);
        });
      });
    });
  });
});
