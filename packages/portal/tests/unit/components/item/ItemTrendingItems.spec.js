import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../../utils';
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
  recordApiResponse: {
    items: [
      { id: '/456/def' },
      { id: '/123/abc' }
    ]
  }
};

const factory = () => shallowMountNuxt(ItemTrendingItems, {
  localVue,
  mocks: {
    $apis: {
      record: {
        find: sinon.stub().resolves(fixtures.recordApiResponse)
      }
    },
    $config: {
      app: {
        baseUrl: 'http://localhost'
      }
    },
    $fetchState: {}
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
});
