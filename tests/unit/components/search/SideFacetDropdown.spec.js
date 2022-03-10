import sinon from 'sinon';
import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../../utils';

import SideFacetDropdown from '@/components/search/SideFacetDropdown.vue';

const localVue = createLocalVue();

const storeDispatchStub = sinon.stub();

const storeCommitSpy = sinon.spy();

const apisRecordSearchStub = sinon.stub().resolves({});

const factory = (options = {}) => shallowMountNuxt(SideFacetDropdown, {
  localVue,
  mocks: {
    $apis: {
      record: {
        search: apisRecordSearchStub
      }
    },
    $fetchState: {},
    $i18n: { locale: 'en' },
    $route: {
      query: {}
    },
    $t: (key) => key,
    $tFacetName: (key) => key,
    $store: {
      commit: storeCommitSpy,
      dispatch: storeDispatchStub,
      getters: {
        'search/collection': false,
        'entity/id': null
      },
      state: {
        search: {
          liveQueries: []
        }
      }
    }
  },
  stubs: ['b-button', 'b-form-checkbox', 'b-dropdown', 'b-dropdown-form', 'b-badge'],
  propsData: {
    type: 'checkbox',
    name: 'COUNTRY',
    ...options.propsData
  }
});

describe('components/search/SideFacetDropdown', () => {
  beforeEach(sinon.resetHistory);

  describe('fetch', () => {
    describe('if fields are not static', () => {
      it('fetches facet from Record API', async() => {
        const wrapper = factory();
        await wrapper.setProps({
          staticFields: null
        });

        await wrapper.vm.fetch();

        expect(apisRecordSearchStub.calledWith({ rows: 0, profile: 'facets', facet: 'COUNTRY' }, { locale: 'en' })).toBe(true);
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

        expect(storeDispatchStub.calledWith('search/queryFacet', 'collection')).toBe(false);
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
  });

  describe('computed', () => {
    describe('groupedOptions', () => {
      const fields = [
        { label: 'http://rightsstatements.org/vocab/InC/1.0/', count: 14263988 },
        { label: 'http://creativecommons.org/publicdomain/mark/1.0/', count: 11778229 },
        { label: 'http://creativecommons.org/licenses/by/4.0/', count: 4052280 },
        { label: 'http://creativecommons.org/licenses/by/3.0/', count: 1088262 },
        { label: 'http://creativecommons.org/licenses/publicdomain/mark/', count: 11890 },
        { label: 'https://creativecommons.org/publicdomain/mark/1.0/', count: 7485 },
        { label: 'Unknown', count: 1 }
      ];

      describe('without groupBy prop', () => {
        const propsData = { groupBy: null };

        it('returns fields as-is', () => {
          const wrapper = factory({ propsData });
          wrapper.setData({ fields });

          expect(wrapper.vm.groupedOptions).toEqual(fields);
        });
      });

      describe('with groupBy prop', () => {
        const groupBy = ['/publicdomain/mark/', '/InC/', '/licenses/by/', '/licenses/by-sa/'];
        const propsData = { groupBy };
        const expected = [
          { label: '*/publicdomain/mark/*', count: 11797604 },
          { label: '*/InC/*', count: 14263988 },
          { label: '*/licenses/by/*', count: 5140542 },
          { label: 'Unknown', count: 1 }
        ];

        it('groups fields by substring', () => {
          const wrapper = factory({ propsData: { groupBy } });
          wrapper.setData({ fields });

          expect(wrapper.vm.groupedOptions).toEqual(expected);
        });
      });
    });

    describe('sortedOptions', () => {
      it('puts selected options to the top, in descending count value order', async() => {
        const wrapper = factory();
        await wrapper.setProps({
          name: 'COUNTRY',
          selected: ['Spain', 'United Kingdom']
        });
        wrapper.setData({
          fields: [
            { label: 'United Kingdom', count: 99 },
            { label: 'Germany', count: 100 },
            { label: 'Netherlands', count: 101 },
            { label: 'Spain', count: 44 }
          ]
        });

        expect(wrapper.vm.sortedOptions[0].label).toBe('United Kingdom');
        expect(wrapper.vm.sortedOptions[1].label).toBe('Spain');
        expect(wrapper.vm.sortedOptions[2].label).toBe('Netherlands');
        expect(wrapper.vm.sortedOptions[3].label).toBe('Germany');
      });
    });
  });

  describe('methods', () => {
    describe('queryFacet', () => {
      it('logs the query while live', async() => {
        const wrapper = factory();
        await wrapper.setProps({
          name: 'TYPE'
        });
        const queryParams = { rows: 0, profile: 'facets', facet: 'TYPE' };

        await wrapper.vm.queryFacet();

        expect(storeCommitSpy.calledWith('search/addLiveQuery', queryParams)).toBe(true);
        expect(storeCommitSpy.calledWith('search/removeLiveQuery', queryParams)).toBe(true);
      });
    });

    describe('filterFacetFields', () => {
      describe('REUSABILITY facet', () => {
        const fields = [
          { label: 'open', count: 28526707 },
          { label: 'restricted', count: 15979894 },
          { label: 'permission', count: 16073238 },
          { label: 'uncategorized', count: 415238 }
        ];

        it('removes "uncategorized" option', async() => {
          const wrapper = factory();
          await wrapper.setProps({
            name: 'REUSABILITY'
          });

          const filtered = wrapper.vm.filterFacetFields(fields);

          expect(filtered.length).toBe(3);
          expect(filtered.map(field => field.label)).toEqual(['open', 'restricted', 'permission']);
        });
      });

      describe('contentTier facet', () => {
        const fields = [
          { label: '0', count: 9686142 },
          { label: '1', count: 15763224 },
          { label: '2', count: 10558597 },
          { label: '3', count: 6293190 },
          { label: '4', count: 18778040 }
        ];

        it('limits contentTier options to fields "2", "3" and "4" in a thematic collection', async() => {
          const wrapper = factory();
          await wrapper.setProps({
            name: 'contentTier'
          });
          wrapper.vm.$store.getters['search/collection'] = true;

          const filtered = wrapper.vm.filterFacetFields(fields);

          expect(filtered.length).toBe(3);
          expect(filtered.map(field => field.label)).toEqual(['2', '3', '4']);
        });

        it('does not limit contentTier options in an organization collection', async() => {
          const wrapper = factory();
          await wrapper.setProps({
            name: 'contentTier'
          });
          wrapper.vm.$store.getters['entity/id'] = 'http://data.europeana.eu/organization/12345';

          const filtered = wrapper.vm.filterFacetFields(fields);

          expect(filtered.length).toBe(5);
          expect(filtered.map(field => field.label)).toEqual(['0', '1', '2', '3', '4']);
        });

        it('limits contentTier options to fields "1", "2", "3" and "4" in non-organization, non-thematic collections', async() => {
          const wrapper = factory();
          await wrapper.setProps({
            name: 'contentTier'
          });
          wrapper.vm.$store.getters['entity/id'] = 'http://data.europeana.eu/base/concept/12345';

          const filtered = wrapper.vm.filterFacetFields(fields);

          expect(filtered.length).toBe(4);
          expect(filtered.map(field => field.label)).toEqual(['1', '2', '3', '4']);
        });

        it('elsewhere limits contentTier options to field "0"', async() => {
          const wrapper = factory();
          await wrapper.setProps({
            name: 'contentTier'
          });

          const filtered = wrapper.vm.filterFacetFields(fields);

          expect(filtered.length).toBe(1);
          expect(filtered.map(field => field.label)).toEqual(['0']);
        });
      });

      describe('facet with theme-specific replacement pattern', () => {
        const fields = [
          { label: 'Chanel (Designer)' },
          { label: 'Paul van Riel (Photographer)' },
          { label: 'Emilio Pucci (Designer)' },
          { label: 'http://www.wikidata.org/entity/Q1142142' }
        ];

        it('limits to the options matching the pattern', async() => {
          const wrapper = factory();
          wrapper.vm.$store.getters['search/collection'] = 'fashion';
          await wrapper.setProps({
            name: 'CREATOR'
          });

          const filtered = wrapper.vm.filterFacetFields(fields);

          expect(filtered.length).toBe(2);
          expect(filtered.map(field => field.label)).toEqual(['Chanel (Designer)', 'Emilio Pucci (Designer)']);
        });
      });
    });

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
