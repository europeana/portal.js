import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../../utils';
import sinon from 'sinon';

import EntityRelatedCollections from '@/components/entity/EntityRelatedCollections.vue';

const localVue = createLocalVue();

const factory = (options = {}) => {
  return shallowMountNuxt(EntityRelatedCollections, {
    localVue,
    propsData: options.propsData,
    mocks: {
      $apis: {
        entity: { find: sinon.stub().resolves(options.responses?.entity?.find || []) },
        record: { search: sinon.stub().resolves(options.responses?.record?.search || {}) }
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

      it('does not query Entity API for related collection details', async() => {
        const wrapper = factory({ propsData });

        await wrapper.vm.fetch();

        expect(wrapper.vm.$apis.entity.find.called).toBe(false);
      });
    });

    describe('without overrides', () => {
      const propsData = {
        type: 'topic',
        identifier: '1-stained-glass'
      };
      const uri = 'http://data.europeana.eu/concept/base/1';
      const relatedUris = [
        'http://data.europeana.eu/concept/base/2',
        'http://data.europeana.eu/concept/base/3',
        'http://data.europeana.eu/concept/base/4',
        'http://data.europeana.eu/concept/base/5'
      ];
      const relatedCollections = [
        { id: 'http://data.europeana.eu/concept/base/2', prefLabel: { en: 'Concept 2' } },
        { id: 'http://data.europeana.eu/concept/base/3', prefLabel: { en: 'Concept 3' } },
        { id: 'http://data.europeana.eu/concept/base/4', prefLabel: { en: 'Concept 4' } }
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
        },
        entity: {
          find: [
            { id: 'http://data.europeana.eu/concept/base/2', type: 'Concept', prefLabel: { en: 'Concept 2' } },
            { id: 'http://data.europeana.eu/concept/base/3', type: 'Concept', prefLabel: { en: 'Concept 3' } },
            { id: 'http://data.europeana.eu/concept/base/4', type: 'Concept', prefLabel: { en: 'Concept 4' } },
            { id: 'http://data.europeana.eu/concept/base/5', type: 'Concept', prefLabel: { es: 'Concept 5' } }
          ]
        }
      };

      it('queries Record API for related collections', async() => {
        const wrapper = factory({ propsData, responses });

        await wrapper.vm.fetch();

        expect(wrapper.vm.$apis.record.search.calledWith(sinon.match.has('query', `skos_concept:"${uri}"`))).toBe(true);
      });

      it('queries Entity API for up to 4 Europeana entity details', async() => {
        const wrapper = factory({ propsData, responses });

        await wrapper.vm.fetch();

        expect(wrapper.vm.$apis.entity.find.calledWith(relatedUris)).toBe(true);
      });

      it('filters, reduces, and records the related collections', async() => {
        const wrapper = factory({ propsData, responses });

        await wrapper.vm.fetch();

        expect(wrapper.vm.relatedCollections).toEqual(relatedCollections);
      });
    });
  });
});
