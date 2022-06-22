import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../../utils';
import sinon from 'sinon';

import EntityRelatedCollections from '@/components/entity/EntityRelatedCollections.vue';

const localVue = createLocalVue();

const factory = ({ propsData, responses } = {}) => {
  return shallowMountNuxt(EntityRelatedCollections, {
    localVue,
    propsData,
    mocks: {
      $apis: {
        record: { search: sinon.stub().resolves(responses?.record?.search || {}) }
      },
      $fetchState: {},
      $t: key => key
    }
  });
};

describe('components/entity/EntityRelatedCollections', () => {
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
      const infixedUri = 'http://data.europeana.eu/concept/base/1';
      const relatedUris = [
        'http://data.europeana.eu/concept/base/2',
        'http://data.europeana.eu/concept/base/3',
        'http://data.europeana.eu/concept/base/4',
        'http://data.europeana.eu/concept/base/5'
      ];
      const responses = {
        record: {
          search: {
            facets: [
              {
                name: 'skos_concept',
                fields: [
                  { label: 'http://data.europeana.eu/concept/base/1' },
                  { label: 'http://data.europeana.eu/concept/base/2' },
                  { label: 'http://www.wikidata.org/entity/1' },
                  { label: 'http://data.europeana.eu/concept/base/3' },
                  { label: 'http://www.wikidata.org/entity/2' },
                  { label: 'http://data.europeana.eu/concept/base/4' },
                  { label: 'http://data.europeana.eu/concept/base/5' },
                  { label: 'http://data.europeana.eu/concept/base/6' }
                ]
              }
            ]
          }
        }
      };

      it('queries Record API for related collections', async() => {
        const wrapper = factory({ propsData, responses });
        const entityQuery = `skos_concept:("${infixedUri}" OR "${uri}")`

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
});
