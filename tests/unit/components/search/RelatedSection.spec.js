import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../../utils';
import sinon from 'sinon';

import RelatedSection from '@/components/search/RelatedSection.vue';

const localVue = createLocalVue();

const relatedCollections = ['National Library of France', 'Voltaire', 'Louis XVI of France', 'National Library of Spain'];

const factory = (options = {}) => {
  return shallowMountNuxt(RelatedSection, {
    localVue,
    propsData: options.propsData,
    mocks: {
      $apis: { entity: { suggest: sinon.stub().resolves(relatedCollections) } },
      $fetchState: {},
      $i18n: { locale: 'en' },
      $t: key => key
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

      it('stores response as relatedCollections', async() => {
        const wrapper = factory({ propsData });

        await wrapper.vm.fetch();

        expect(wrapper.vm.relatedCollections).toEqual(relatedCollections);
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
