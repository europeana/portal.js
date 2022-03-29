import sinon from 'sinon';
import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../../utils';
import BootstrapVue from 'bootstrap-vue';

import SideFacetDropdown from '@/components/search/SideFacetDropdown.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const storeDispatchStub = sinon.stub();

const storeCommitSpy = sinon.spy();

const apisRecordSearchStub = sinon.stub().resolves({});

const countryFields = [
  { label: 'United Kingdom', count: 99 },
  { label: 'Germany', count: 100 },
  { label: 'Netherlands', count: 101 },
  { label: 'Spain', count: 44 }
];

const providerFields = [
  { label: 'OpenUp!', count: 10002274 },
  { label: 'The European Library', count: 6860099 },
  { label: 'German Digital Library', count: 4101384 },
  { label: 'Swedish Open Cultural Heritage | K-samsök', count: 3515682 },
  { label: 'LoCloud', count: 3255930 },
  { label: 'Digital Libraries Federation', count: 2493080 },
  { label: 'CARARE', count: 2238128 },
  { label: 'Hispana', count: 1720541 },
  { label: 'Digitale Collectie', count: 1365031 },
  { label: 'National Library of France', count: 1196751 },
  { label: 'Formula Aggregation Service of the National Library of Finland', count: 971369 },
  { label: 'CulturaItalia', count: 874844 },
  { label: 'European Fashion Heritage Association', count: 863851 },
  { label: 'Europeana Sounds', count: 774239 },
  { label: 'AthenaPlus', count: 725854 },
  { label: 'Judaica Europeana/Jewish Heritage Network', count: 679909 },
  { label: 'National Library of Poland', count: 600413 },
  { label: 'Kulturpool', count: 592678 },
  { label: 'EFG - The European Film Gateway', count: 551025 },
  { label: 'Greek Aggregator SearchCulture.gr | National Documentation Centre (EKT)', count: 493768 },
  { label: 'Museu', count: 466937 },
  { label: 'PHOTOCONSORTIUM', count: 426155 },
  { label: 'Estonian e-Repository and Conservation of Collections', count: 401520 },
  { label: 'HOPE - Heritage of the People\'s Europe', count: 399319 },
  { label: 'Slovenian National E-content Aggregator', count: 396375 },
  { label: 'Forum Hungaricum Non-profit Ltd.', count: 392535 },
  { label: 'EUscreen', count: 376601 },
  { label: 'Rijksmuseum', count: 337263 },
  { label: 'Linked Heritage', count: 320881 },
  { label: 'DK-National Aggregation Service', count: 275775 },
  { label: 'EAGLE', count: 249986 },
  { label: 'DC4EU - Dutch Collections for Europe', count: 206968 },
  { label: 'Athena', count: 199267 },
  { label: 'moteur Collections ; France', count: 187429 },
  { label: 'International Association of Labour History Institutions', count: 170429 },
  { label: 'Heritage plus.be', count: 136579 },
  { label: 'LT-Aggregator Service National Library of Lithuania', count: 135624 },
  { label: 'DM2E', count: 117038 },
  { label: 'National Library of the Czech Republic', count: 116098 },
  { label: 'RNOD-Portugal', count: 114552 },
  { label: 'Регионална библиотека ПЕНЧО СЛАВЕЙКОВ - Варна / Public Library - Varna', count: 109753 },
  { label: 'Archives Portal Europe', count: 106619 },
  { label: 'Digiphil', count: 105885 },
  { label: 'DigiPhil', count: 100243 },
  { label: 'Museumap.hu', count: 97130 },
  { label: 'Wellcome Collection', count: 92178 },
  { label: 'EUInsideDA', count: 91343 },
  { label: 'CultureGrid', count: 83714 },
  { label: 'AMSHistorica - University of Bologna', count: 75075 },
  { label: 'eSbírky', count: 75066 },
  { label: 'EuropeanaLocal Deutschland', count: 74549 },
  { label: 'Foundation Virtual Library Miguel de Cervantes', count: 70473 },
  { label: 'Czech digital library/Česká digitální knihovna', count: 65495 },
  { label: 'MIMO - Musical Instrument Museums Online', count: 61896 },
  { label: 'Lucian Blaga Central University Library, Cluj-Napoca, Romania', count: 58370 }
];

const factory = (options = {}) => shallowMountNuxt(SideFacetDropdown, {
  localVue,
  mocks: {
    $apis: {
      record: {
        search: apisRecordSearchStub
      }
    },
    $fetchState: options.fetchState || {},
    $i18n: { locale: 'en' },
    $route: {
      query: {}
    },
    $t: (key) => key,
    $tc: (key) => key,
    $te: () => true,
    $store: {
      commit: storeCommitSpy,
      dispatch: storeDispatchStub,
      getters: {
        'search/collection': false,
        'entity/id': null
      },
      state: {
        search: {}
      }
    }
  },
  stubs: ['b-form-tags'],
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
      const staticFields = null;

      describe('and are not yet fetched', () => {
        const fetched = false;

        describe('but may be fetched', () => {
          const mayFetch = true;

          it('fetches facet from Record API', async() => {
            const wrapper = factory({
              propsData: { staticFields }
            });
            wrapper.setData({
              mayFetch,
              fetched
            });

            await wrapper.vm.fetch();

            expect(apisRecordSearchStub.calledWith({ rows: 0, profile: 'facets', facet: 'COUNTRY' }, { locale: 'en' })).toBe(true);
          });

          it('marks facet as fetched', async() => {
            const wrapper = factory({
              propsData: { staticFields }
            });
            wrapper.setData({
              mayFetch,
              fetched
            });

            await wrapper.vm.fetch();

            expect(wrapper.vm.fetched).toBe(true);
          });
        });

        describe('and may not be fetched', () => {
          const mayFetch = false;

          it('does not fetch facet', async() => {
            const wrapper = factory({
              propsData: { staticFields }
            });
            wrapper.setData({
              mayFetch,
              fetched
            });

            await wrapper.vm.fetch();

            expect(apisRecordSearchStub.called).toBe(false);
          });

          it('leaves facet marked as not fetched', async() => {
            const wrapper = factory({
              propsData: { staticFields }
            });
            wrapper.setData({
              mayFetch,
              fetched
            });

            await wrapper.vm.fetch();

            expect(wrapper.vm.fetched).toBe(false);
          });
        });
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
    describe('searchable', () => {
      describe('when `search` prop is `true`', () => {
        const search = true;

        describe('and there are available options', () => {
          const fields = countryFields;

          it('is `true`', async() => {
            const wrapper = factory({ propsData: { search } });
            await wrapper.setData({
              fields,
              fetched: true
            });

            expect(wrapper.vm.searchable).toBe(true);
          });
        });

        describe('but there are no available options', () => {
          const fields = [];

          it('is `false`', async() => {
            const wrapper = factory({ propsData: { search } });
            await wrapper.setData({
              fields,
              fetched: true
            });

            expect(wrapper.vm.searchable).toBe(false);
          });
        });
      });

      describe('when `search` prop is `false`', () => {
        const search = false;
        const fields = countryFields;

        it('is `false`', async() => {
          const wrapper = factory({ propsData: { search } });
          await wrapper.setData({
            fields,
            fetched: true
          });

          expect(wrapper.vm.searchable).toBe(false);
        });
      });
    });

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
          const wrapper = factory({ propsData });
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
        wrapper.setData({ fields: countryFields });

        expect(wrapper.vm.sortedOptions[0].label).toBe('United Kingdom');
        expect(wrapper.vm.sortedOptions[1].label).toBe('Spain');
        expect(wrapper.vm.sortedOptions[2].label).toBe('Netherlands');
        expect(wrapper.vm.sortedOptions[3].label).toBe('Germany');
      });
    });

    describe('availableSortedOptions', () => {
      describe('when nothing selected and no search term input', () => {
        it('returns all options', async() => {
          const wrapper = factory();
          wrapper.setData({ fetched: true, fields: countryFields });

          expect(wrapper.vm.availableSortedOptions.length).toBe(countryFields.length);
        });

        it('returns radio options', async() => {
          const wrapper = factory({
            propsData: {
              name: 'collection',
              staticFields: ['ww1', 'archaeology'],
              type: 'radio',
              searchFacet: 'ww'
            }
          });

          expect(wrapper.vm.availableSortedOptions.length).toBe(2);
        });
      });
      describe('when options selected', () => {
        it('returns the options that are not yet selected', async() => {
          const wrapper = factory({
            propsData: {
              selected: ['Spain', 'United Kingdom']
            }
          });
          wrapper.setData({ fields: countryFields });

          expect(wrapper.vm.availableSortedOptions.some(option => option.label === 'Spain')).toBe(false);
        });
      });
      describe('when a search term is inserted', () => {
        it('returns the options that match the search term', () => {
          const wrapper = factory({
            propsData: {
              selected: ['Spain', 'United Kingdom']
            }
          });

          wrapper.setData({
            fetched: true,
            fields: countryFields,
            searchFacet: 'netherlands'
          });

          expect(wrapper.vm.availableSortedOptions.some(option => option.label === 'Netherlands')).toBe(true);
          expect(wrapper.vm.availableSortedOptions.some(option => option.label === 'Germany')).toBe(false);
        });
        describe('and the options are of the radio type', () => {
          it('returns the options that match the search term', () => {
            const wrapper = factory({
              propsData: {
                name: 'collection',
                staticFields: ['ww1', 'archaeology', 'art', 'fashion'],
                type: 'radio',
                searchFacet: 'ww'
              }
            });

            expect(wrapper.vm.availableSortedOptions.some(option => option === 'ww1')).toBe(true);
          });
        });
      });
    });

    describe('availableSortedDisplayableOptions', () => {
      describe('when nothing selected and no search term input', () => {
        it('returns the first 50 options', async() => {
          const wrapper = factory({
            propsData: {
              search: true
            }
          });
          wrapper.setData({ fetched: true, fields: providerFields });

          expect(wrapper.vm.availableSortedDisplayableOptions.length).toBe(50);
        });
      });
      describe('when options selected', () => {
        it('returns the first 50 options that are not yet selected', async() => {
          const wrapper = factory({
            propsData: {
              search: true,
              selected: ['OpenUp!']
            }
          });
          wrapper.setData({ fetched: true, fields: providerFields });

          expect(wrapper.vm.availableSortedDisplayableOptions.some(option => option.label === 'OpenUp!')).toBe(false);
          expect(wrapper.vm.availableSortedDisplayableOptions.length).toBe(50);
        });
      });
      describe('when a search term is inserted', () => {
        it('returns the options that match the search term', () => {
          const wrapper = factory({
            propsData: {
              selected: ['OpenUp!']
            }
          });

          wrapper.setData({
            fetched: true,
            fields: providerFields,
            searchFacet: 'the european'
          });

          expect(wrapper.vm.availableSortedOptions.some(option => option.label === 'The European Library')).toBe(true);
          expect(wrapper.vm.availableSortedOptions.some(option => option.label === 'German Digital Library')).toBe(false);
        });
      });
    });

    describe('criteria', () => {
      it('turns the facet search term in a trimmed and lower cased string', () => {
        const wrapper = factory();
        wrapper.setData({
          searchFacet: '  Im looking For a Facet '
        });

        expect(wrapper.vm.criteria).toBe('im looking for a facet');
      });
    });

    describe('activeLabel', () => {
      describe('when there are options selected', () => {
        it('returns true', () => {
          const wrapper = factory({
            propsData: {
              selected: ['Spain', 'United Kingdom']
            }
          });

          expect(wrapper.vm.activeLabel).toBe(true);
        });
      });
      // describe('when a search term is inserted', () => {
      //   it('returns true', () => {
      // const wrapper = factory({
      //   propsData: {
      //     search: true
      //   }
      // });
      // wrapper.setData({ fields: countryFields });

      // const searchInput = wrapper.find('[data-qa="side facet dropdown input"]');
      // searchInput.trigger('keydown.e');

      // expect(wrapper.vm.activeLabel).toBe(true);
      // });
      // });
    });

    describe('isColourPalette', () => {
      it('does not show a colour palette', () => {
        const wrapper = factory();
        expect(wrapper.vm.isColourPalette).toBe(false);
      });

      it('does show a colour palette', async() => {
        const wrapper = factory();
        await wrapper.setProps({
          name: 'COLOURPALETTE'
        });
        expect(wrapper.vm.isColourPalette).toBe(true);
      });
    });

    describe('facetName', () => {
      it('returns a translated facet name', () => {
        const wrapper = factory();
        expect(wrapper.vm.facetName).toBe('facets.COUNTRY.name');
      });
    });
  });

  describe('methods', () => {
    describe('refetch', () => {
      it('flags as not fetched', async() => {
        const wrapper = factory();
        wrapper.setData({ fetched: true });

        wrapper.vm.refetch();
        await wrapper.vm.$nextTick();

        expect(wrapper.vm.fetched).toBe(false);
      });

      it('triggers fetch', async() => {
        const wrapper = factory();
        sinon.spy(wrapper.vm, '$fetch');

        await wrapper.vm.refetch();

        expect(wrapper.vm.$fetch.called).toBe(true);
      });
    });

    describe('prefetch', () => {
      describe('when already fetched', () => {
        const fetched = true;

        it('does not fetch', async() => {
          const wrapper = factory();
          wrapper.setData({ fetched });
          sinon.spy(wrapper.vm, '$fetch');

          await wrapper.vm.prefetch();

          expect(wrapper.vm.$fetch.called).toBe(false);
        });
      });

      describe('when not yet fetched', () => {
        const fetched = false;

        it('triggers fetch', async() => {
          const wrapper = factory();
          wrapper.setData({ fetched });
          sinon.spy(wrapper.vm, '$fetch');

          await wrapper.vm.prefetch();

          expect(wrapper.vm.$fetch.called).toBe(true);
        });

        it('toggles `mayFetch` while fetching', async() => {
          const wrapper = factory();
          wrapper.setData({ fetched });

          const promise = wrapper.vm.prefetch();

          expect(wrapper.vm.mayFetch).toBe(true);
          await promise;
          expect(wrapper.vm.mayFetch).toBe(false);
        });
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

    describe('removeOption', () => {
      it('removes an option', async() => {
        const wrapper = factory();
        wrapper.vm.removeOption({ 'tag': 'Sweden', removeTag() {} });

        expect(wrapper.emitted().changed).toBeTruthy();
      });
    });

    describe('selectOption', () => {
      it('selects an option', async() => {
        const wrapper = factory();
        wrapper.vm.selectOption({ 'option': { 'count': '1000', 'label': 'Sweden' }, addTag() {}, removeTag() {} });

        expect(wrapper.emitted().changed).toBeTruthy();
      });
    });
  });
});
