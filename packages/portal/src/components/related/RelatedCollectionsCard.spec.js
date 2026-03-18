import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '@test/utils.js';
import sinon from 'sinon';

import RelatedCollectionsCard from '@/components/related/RelatedCollectionsCard.vue';

const localVue = createLocalVue();

const relatedCollections = [
  { id: 'http://data.europeana.eu/organization/1482250000002112001', prefLabel: 'National Library of France' },
  { id: 'http://data.europeana.eu/agent/59833', prefLabel: 'Voltaire' },
  { id: 'http://data.europeana.eu/agent/146742', prefLabel: 'Louis XVI of France' },
  { id: 'http://data.europeana.eu/concept/17', prefLabel: { en: 'Manusscript' } }
];

const factory = (options = {}) => {
  return shallowMountNuxt(RelatedCollectionsCard, {
    localVue,
    propsData: options.propsData,
    mocks: {
      $apis: { entity: { suggest: sinon.stub().resolves(relatedCollections) } },
      $i18n: { locale: 'en' },
      $t: key => key,
      $store: {
        state: {
          entity: {
            curatedEntities: [
              {
                name: 'World War I',
                nameEN: 'World War I',
                identifier: 'http://data.europeana.eu/concept/83',
                genre: 'ww1'
              },
              {
                name: 'Manuscripts',
                nameEN: 'Manuscripts',
                identifier: 'http://data.europeana.eu/concept/17',
                genre: 'manuscript'
              }
            ]
          },
          search: {
            view: 'grid'
          }
        }
      }
    },
    stubs: ['b-card', 'EntityBadges']
  });
};

describe('components/related/RelatedCollectionsCard', () => {
  describe('fetch', () => {
    describe('with overrides', () => {
      const overrides = relatedCollections;
      const propsData = { overrides };

      it('stores them as relatedCollections', async() => {
        const wrapper = factory({ propsData });

        await wrapper.vm.fetch();

        expect(wrapper.vm.relatedCollections).toEqual(relatedCollections);
      });

      it('does not query the Entity API', async() => {
        const wrapper = factory({ propsData });

        await wrapper.vm.fetch();

        expect(wrapper.vm.$apis.entity.suggest.called).toBe(false);
      });

      it('does not emit relatedFetched event', async() => {
        const wrapper = factory({ propsData });

        await wrapper.vm.fetch();

        expect(wrapper.emitted('relatedFetched')).toBeUndefined();
      });
    });

    describe('with a query', () => {
      const propsData = { query: 'art' };

      it('queries the Entity API for suggestions via $apis plugin', async() => {
        const wrapper = factory({ propsData });

        await wrapper.vm.fetch();

        expect(wrapper.vm.$apis.entity.suggest.calledWith(propsData.query, {
          language: wrapper.vm.$i18n.locale,
          rows: 4
        })).toBe(true);
      });

      it('stores response with overrides as relatedCollections', async() => {
        const wrapper = factory({ propsData });

        await wrapper.vm.fetch();

        const expectedRelated = relatedCollections;
        expectedRelated[3].prefLabel = { en: 'Manuscripts' };
        expect(wrapper.vm.relatedCollections).toEqual(expectedRelated);
      });

      it('emits relatedFetched event with response', async() => {
        const wrapper = factory({ propsData });

        await wrapper.vm.fetch();

        expect(wrapper.emitted('relatedFetched')[0][0]).toEqual(relatedCollections);
      });
    });

    describe('without a query', () => {
      it('does not query Entity API', () => {
        const wrapper = factory();

        wrapper.vm.fetch();

        expect(wrapper.vm.$apis.entity.suggest.called).toBe(false);
      });
    });
  });
});
