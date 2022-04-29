import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../../utils';
import sinon from 'sinon';

import RelatedSection from '@/components/search/RelatedSection.vue';

const localVue = createLocalVue();

const relatedCollections = [
  { id: 'http://data.europeana.eu/organization/1482250000002112001', prefLabel: 'National Library of France' },
  { id: 'http://data.europeana.eu/agent/base/59833', prefLabel: 'Voltaire' },
  { id: 'http://data.europeana.eu/agent/base/146742', prefLabel: 'Louis XVI of France' },
  { id: 'http://data.europeana.eu/concept/base/17', prefLabel: { en: 'Manusscript' } }
];

const factory = (options = {}) => {
  return shallowMountNuxt(RelatedSection, {
    localVue,
    propsData: options.propsData,
    mocks: {
      $apis: { entity: { suggest: sinon.stub().resolves(relatedCollections) } },
      $fetchState: {},
      $i18n: { locale: 'en' },
      $t: key => key,
      $store: {
        state: {
          entity: {
            curatedEntities: [
              {
                name: 'World War I',
                identifier: 'http://data.europeana.eu/concept/base/83',
                genre: 'ww1'
              },
              {
                name: 'Manuscripts',
                identifier: 'http://data.europeana.eu/concept/base/17',
                genre: 'manuscript'
              }
            ]
          }
        }
      }
    }
  });
};

describe('components/search/RelatedSection', () => {
  describe('fetch', () => {
    describe('with a query', () => {
      const propsData = { query: 'art' };

      it('queries the Entity API for suggestions via $apis plugin', () => {
        const wrapper = factory({ propsData });

        wrapper.vm.fetch();

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
