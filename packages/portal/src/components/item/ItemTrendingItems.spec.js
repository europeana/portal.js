import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '@test/utils.js';
import nock from 'nock';
import sinon from 'sinon';

import ItemTrendingItems from '@/components/item/ItemTrendingItems';

const localVue = createLocalVue();

const fixtures = {
  localApiResponse: {
    items: [
      { uri: 'http://data.europeana.eu/item/123/abc' },
      { uri: 'http://data.europeana.eu/item/456/def' }
    ]
  },
  recordApiFindResponse: {
    items: [
      { id: '/456/def' },
      { id: '/123/abc' }
    ]
  },
  recordApiSearchResponse: {
    items: [
      { id: '/456/random1' },
      { id: '/123/random2' }
    ]
  }
};

const factory = ({ mocks = {} } = {}) => shallowMountNuxt(ItemTrendingItems, {
  localVue,
  mocks: {
    $t: (key) => key,
    $apis: {
      record: {
        find: sinon.stub().resolves(fixtures.recordApiFindResponse),
        search: sinon.stub().resolves(fixtures.recordApiSearchResponse)
      }
    },
    $config: {
      app: {
        baseUrl: 'http://localhost'
      }
    },
    $features: { mockTrendingItems: false },
    ...mocks
  },
  stubs: ['b-container']
});

describe('ItemTrendingItems', () => {
  beforeEach(() => {
    nock('http://localhost')
      .get('/_api/events/trending')
      .reply(200, fixtures.localApiResponse);
  });
  afterEach(() => {
    sinon.resetHistory();
    nock.cleanAll();
  });
  afterAll(sinon.resetBehavior);

  describe('fetch', () => {
    describe('by default', () => {
      it('gets trending items from local API', async() => {
        const wrapper = factory();

        await wrapper.vm.fetch();

        expect(nock.isDone()).toBe(true);
      });

      it('gets item metadata from Record API', async() => {
        const wrapper = factory();

        await wrapper.vm.fetch();

        expect(wrapper.vm.$apis.record.find.called).toBe(true);
      });

      it('stores items in data, respecting trending order', async() => {
        const wrapper = factory();

        await wrapper.vm.fetch();

        expect(wrapper.vm.items).toEqual([
          { id: '/123/abc' },
          { id: '/456/def' }
        ]);
      });
    });

    describe('when mockTrendingItems feature is toggled on', () => {
      const mocks = { $features: { mockTrendingItems: true } };

      it('gets random items metadata from Record API', async() => {
        const wrapper = factory({ mocks });

        await wrapper.vm.fetch();

        expect(wrapper.vm.$apis.record.search.called).toBe(true);
      });

      it('stores items in data', async() => {
        const wrapper = factory({ mocks });

        await wrapper.vm.fetch();

        expect(wrapper.vm.items).toEqual(fixtures.recordApiSearchResponse.items);
      });
    });
  });
});
