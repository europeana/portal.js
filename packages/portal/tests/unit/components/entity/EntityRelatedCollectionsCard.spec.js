import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../../utils';
import sinon from 'sinon';

import EntityRelatedCollectionsCard from '@/components/entity/EntityRelatedCollectionsCard.vue';

const localVue = createLocalVue();

const factory = ({ propsData = {}, data = {}, responses } = {}) => {
  return shallowMountNuxt(EntityRelatedCollectionsCard, {
    localVue,
    propsData,
    data: () => ({ ...data }),
    mocks: {
      $apis: {
        record: { search: sinon.stub().resolves(responses?.record?.search || {}) }
      },
      $store: {
        state: {
          search: {
            view: 'grid'
          }
        }
      },
      $t: (key) => key
    },
    stubs: ['RelatedCollectionsCard']
  });
};

describe('components/entity/EntityRelatedCollectionsCard', () => {
  describe('fetch', () => {
    describe('with overrides', () => {
      const propsData = {
        type: 'topic',
        identifier: '30-cartoon',
        overrides: ['Curated collection']
      };

      it('uses the overrides as the related collections', async() => {
        const wrapper = factory({ propsData });

        await wrapper.vm.fetch();

        expect(wrapper.vm.relatedCollections).toEqual(propsData.overrides);
      });

      it('does not query Record API for related collections', async() => {
        const wrapper = factory({ propsData });

        await wrapper.vm.fetch();

        expect(wrapper.vm.$apis.record.search.called).toBe(false);
      });
    });

    describe('without overrides', () => {
      const propsData = {
        type: 'topic',
        identifier: '1-stained-glass'
      };
      const uri = 'http://data.europeana.eu/concept/1';
      const relatedUris = [
        'http://data.europeana.eu/concept/2',
        'http://data.europeana.eu/concept/3',
        'http://data.europeana.eu/concept/4',
        'http://data.europeana.eu/concept/5'
      ];
      const responses = {
        record: {
          search: {
            facets: [
              {
                name: 'skos_concept',
                fields: [
                  { label: 'http://data.europeana.eu/concept/1' },
                  { label: 'http://data.europeana.eu/concept/2' },
                  { label: 'http://www.wikidata.org/entity/1' },
                  { label: 'http://data.europeana.eu/concept/3' },
                  { label: 'http://www.wikidata.org/entity/2' },
                  { label: 'http://data.europeana.eu/concept/4' },
                  { label: 'http://data.europeana.eu/concept/5' },
                  { label: 'http://data.europeana.eu/concept/6' }
                ]
              }
            ]
          }
        }
      };

      it('queries Record API for related collections', async() => {
        const wrapper = factory({ propsData, responses });
        const entityQuery = `skos_concept:"${uri}"`;

        await wrapper.vm.fetch();

        expect(wrapper.vm.$apis.record.search.calledWith(sinon.match.has('query', entityQuery))).toBe(true);
      });

      it('filters, reduces, and records the related collection URIs', async() => {
        const wrapper = factory({ propsData, responses });

        await wrapper.vm.fetch();

        expect(wrapper.vm.entityUris).toEqual(relatedUris);
      });

      describe('but Record API returned no related collections', () => {
        const responses = {
          record: {
            search: {}
          }
        };

        it('records blank array for related collections', async() => {
          const wrapper = factory({ propsData, responses });

          await wrapper.vm.fetch();

          expect(wrapper.vm.relatedCollections).toEqual([]);
        });
      });
    });
  });

  describe('methods', () => {
    describe('handleRelatedCollectionsCardFetched', () => {
      const propsData = {
        type: 'topic',
        identifier: '3012-fishing'
      };
      const data = { entityUris: ['http://data.europeana.eu/concept/48'] };
      const relatedCollections = [{ id: 'http://data.europeana.eu/concept/48' }];

      it('is triggered by entitiesFromUrisFetched event on related collections component', () => {
        const mocks = { handleRelatedCollectionsCardFetched: sinon.spy() };
        const wrapper = factory({ propsData, data, mocks });

        wrapper.vm.handleRelatedCollectionsCardFetched(relatedCollections);

        expect(wrapper.vm.relatedCollections).toEqual(relatedCollections);
      });
    });
  });
});
