import sinon from 'sinon';
import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../../utils';

import SideFacetDropdown from '@/components/search/SideFacetDropdown.vue';

const localVue = createLocalVue();

const countryFields = [
  { label: 'Netherlands', count: 101 },
  { label: 'Germany', count: 100 },
  { label: 'United Kingdom', count: 99 },
  { label: 'Spain', count: 44 }
];
const contentTierFields = [
  { label: '"0"', count: 9686142 },
  { label: '"1"', count: 15763224 },
  { label: '"2"', count: 10558597 },
  { label: '"3"', count: 6293190 },
  { label: '"4"', count: 18778040 }
];
const storeDispatchStub = sinon.stub();
storeDispatchStub
  .withArgs('search/queryFacets', { facet: 'COUNTRY' })
  .resolves([
    { name: 'COUNTRY', fields: countryFields }
  ]);
storeDispatchStub
  .withArgs('search/queryFacets', { facet: 'contentTier' })
  .resolves([
    { name: 'contentTier', fields: contentTierFields }
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
      dispatch: storeDispatchStub,
      getters: {
        'search/collection': false
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

        expect(storeDispatchStub.calledWith('search/queryFacets', { facet: 'COUNTRY' })).toBe(true);
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

        expect(wrapper.vm.fetched).toBe(true);
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

        expect(wrapper.vm.fetched).toBe(true);
      });
    });

    describe('contentTier filter', () => {
      it('limits contentTier options to fields "2", "3" and "4" in a thematic collection', async() => {
        const wrapper = factory();
        await wrapper.setProps({
          name: 'contentTier'
        });
        wrapper.vm.$store.getters['search/collection'] = true;

        await wrapper.vm.fetch();

        expect(wrapper.vm.fields.length).toBe(3);
        expect(wrapper.vm.fields.map(field => field.label)).toEqual(['"2"', '"3"', '"4"']);
      });

      it('elsewhere limits contentTier options to field "0"', async() => {
        const wrapper = factory();
        await wrapper.setProps({
          name: 'contentTier'
        });

        await wrapper.vm.fetch();

        expect(wrapper.vm.fields.length).toBe(1);
        expect(wrapper.vm.fields.map(field => field.label)).toEqual(['"0"']);
      });
    });
  });

  it('puts selected options to the top, in descending count value order', async() => {
    const wrapper = factory();
    await wrapper.setProps({
      name: 'COUNTRY',
      selected: ['Spain', 'United Kingdom']
    });
    await wrapper.vm.fetch();

    expect(wrapper.vm.sortedOptions[0].label).toBe('United Kingdom');
    expect(wrapper.vm.sortedOptions[1].label).toBe('Spain');
    expect(wrapper.vm.sortedOptions[2].label).toBe('Netherlands');
    expect(wrapper.vm.sortedOptions[3].label).toBe('Germany');
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

          expect(wrapper.vm.$fetch.called).toBe(true);
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

          expect(wrapper.vm.$fetch.called).toBe(true);
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
