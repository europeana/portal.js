import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../../utils';
import sinon from 'sinon';

import RelatedGalleries from '@/components/related/RelatedGalleries.vue';

const localVue = createLocalVue();

const setGalleriesResponse = {
  data: {
    items: [
      {
        id: 'http://data.europeana.eu/set/001',
        title: {
          en: 'testSet 001'
        },
        visibility: 'published',
        items: [
          { edmPreview: 'http://data.europeana.eu/item/191/item_D4UCMBDUPV2QGEDH7NJUTED2L3M2BJXQ' }
        ]
      },
      {
        id: 'http://data.europeana.eu/set/002',
        title: {
          en: 'testSet002'
        },
        visibility: 'published',
        items: [
          { edmPreview: 'http://data.europeana.eu/item/180/10622_685031B1_9C63_4D0E_80DB_7F03BDC89146_cho' }
        ]
      }
    ]
  }
};
// const relatedGalleriesIdentifiers = ['blog-1', 'exhibition-1', 'exhibition-2', 'blog-2'];

const factory = ({ propsData, mocks } = {})  => shallowMountNuxt(RelatedGalleries, {
  localVue,
  propsData,
  mocks: {
    $apis: {
      set: {
        search: sinon.stub().resolves(setGalleriesResponse)
      },
      thumbnail: {
        edmPreview: (img) => img?.[0]
      }
    },
    $route: {
      query: {}
    },
    $t: (key) => key,
    ...mocks
  },
  stubs: ['b-card-group', 'b-card']
});

describe('components/related/RelatedGalleries', () => {
  afterEach(sinon.resetHistory);

  describe('fetch', () => {
    describe('when a query is supplied', () => {
      const query = 'spider';

      it('queries set API for content filtered by the query', async() => {
        const wrapper = factory({ propsData: { query } });

        await wrapper.vm.fetch();

        expect(wrapper.vm.$apis.set.search.calledWith({
          query,
          qf: 'visibility:published',
          pageSize: 3,
          page: 0,
          profile: 'standard'
        }, { withMinimalItemPreviews: true })).toBe(true);
      });

      describe('when no related galleries are found', () => {
        it('keeps empty array fallback', async() => {
          const wrapper = factory({ propsData: { query },
            mocks: { $apis: { set: { search: sinon.stub().resolves({ data: {} }) } } } });

          await wrapper.vm.fetch();

          expect(wrapper.vm.relatedGalleries).toEqual([]);
        });
      });
    });

    describe('and no query is supplied', () => {
      it('does not query Contentful', async() => {
        const wrapper = factory();

        await wrapper.vm.fetch();

        expect(wrapper.vm.$apis.set.search.called).toBe(false);
      });
    });
  });
});
