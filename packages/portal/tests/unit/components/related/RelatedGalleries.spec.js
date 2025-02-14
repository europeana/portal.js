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
        isShownBy: { thumbnail: 'http://data.europeana.eu/item/191/item_D4UCMBDUPV2QGEDH7NJUTED2L3M2BJXQ' }
      },
      {
        id: 'http://data.europeana.eu/set/002',
        title: {
          en: 'testSet002'
        },
        visibility: 'published',
        isShownBy: { thumbnail: 'http://data.europeana.eu/item/180/10622_685031B1_9C63_4D0E_80DB_7F03BDC89146_cho' }
      }
    ]
  }
};

const relatedGalleries = [
  {
    slug: '001-testset-001',
    title: {
      en: 'testSet 001'
    },
    thumbnail: 'https://api.europeana/thumbnail/testset-001.jpg'
  },
  {
    slug: '002-testset-002',
    title: {
      en: 'testSet002'
    },
    thumbnail: 'https://api.europeana/thumbnail/testset-002.jpg'
  }
];

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
    $i18n: { locale: 'en' },
    $route: {
      query: {}
    },
    $store: {
      state: {
        search: {
          view: 'grid'
        }
      }
    },
    $t: (key) => key,
    ...mocks
  },
  stubs: ['b-card-group', 'b-card', 'b-card-title']
});

describe('components/related/RelatedGalleries', () => {
  afterEach(sinon.resetHistory);

  describe('fetch', () => {
    describe('with overrides', () => {
      const overrides = relatedGalleries;
      const propsData = { overrides };

      it('stores them as relatedGalleries', async() => {
        const wrapper = factory({ propsData });

        await wrapper.vm.fetch();

        expect(wrapper.vm.relatedGalleries).toEqual(relatedGalleries);
      });

      it('does not query the Entity API', async() => {
        const wrapper = factory({ propsData });

        await wrapper.vm.fetch();

        expect(wrapper.vm.$apis.set.search.called).toBe(false);
      });

      it('does not emit fetched event', async() => {
        const wrapper = factory({ propsData });

        await wrapper.vm.fetch();

        expect(wrapper.emitted('fetched')).toBeUndefined();
      });
    });

    describe('when a query is supplied', () => {
      const query = 'spider';

      it('queries set API for content filtered by the query', async() => {
        const wrapper = factory({ propsData: { query } });

        await wrapper.vm.fetch();

        expect(wrapper.vm.$apis.set.search.calledWith({
          query,
          qf: ['visibility:published', `lang:${wrapper.vm.$i18n.locale}`],
          pageSize: 3,
          page: 1,
          profile: 'items.meta'
        }, { withMinimalItemPreviews: true })).toBe(true);
      });

      it('emits fetched event with response', async() => {
        const wrapper = factory({ propsData: { query } });

        await wrapper.vm.fetch();

        expect(wrapper.emitted('fetched')[0][0]).toEqual(wrapper.vm.relatedGalleries);
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
