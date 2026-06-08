import sinon from 'sinon';

import * as useMakeToastModule from '@/composables/makeToast';
import { usePinnedItems } from './pinnedItems.js';

import { createLocalVue, shallowMount } from '@vue/test-utils';

const component = {
  template: '<span />',
  setup() {
    const { pin, unpin } = usePinnedItems();
    return { pin, unpin };
  }
};

const makeToastSpy = sinon.spy();
const $nuxt = {
  context: {
    $apis: {
      entity: {
        retrieve: sinon.stub().resolves([])
      },
      set: {
        create: sinon.stub().resolves({}),
        deleteItems: sinon.stub().resolves(),
        pinItem: sinon.stub().resolves(),
        requestSet: sinon.stub().resolves({}),
        search: sinon.stub().resolves([])
      }
    }
  }
};
const $bvModal = {
  show: sinon.spy()
};
const $i18n = {
  locale: 'en',
  t: (key) => key
};

const factory = () => {
  const localVue = createLocalVue();
  localVue.prototype.$bvModal = $bvModal;
  localVue.prototype.$i18n = $i18n;
  localVue.prototype.$nuxt = $nuxt;
  const wrapper = shallowMount(component, {
    localVue
  });
  return wrapper;
};

const ENTITY_ID = 'http://data.europeana.eu/concept/67';
const ENTITY_ITEMS_BEST_SET_ID = 'http://data.europena.eu/set/89';
const ITEM_ID = 'http://data.europeana.eu/item/123/abc';

describe('useMakeToast', () => {
  beforeAll(() => {
    sinon.stub(useMakeToastModule, 'default').returns({
      makeToast: makeToastSpy
    });
  });
  afterEach(sinon.resetHistory);
  afterAll(sinon.restore);

  describe('unpin', () => {
    beforeEach(() => {
      $nuxt.context.$apis.set.search.resolves({ total: 1, items: [ENTITY_ITEMS_BEST_SET_ID] });
    });

    it('searches for an EntityBestItemsSet for the entity', async() => {
      const wrapper = factory();

      await wrapper.vm.unpin(ITEM_ID, ENTITY_ID);

      expect($nuxt.context.$apis.set.search.calledWith({
        profile: 'items',
        query: 'type:EntityBestItemsSet',
        qf: `subject:${ENTITY_ID}`
      })).toBe(true);
    });

    describe('when no EntityBestItemsSet for the entity is found', () => {
      beforeEach(() => {
        $nuxt.context.$apis.set.search.resolves({ total: 0 });
      });

      it('throws a Not Found error', async() => {
        const wrapper = factory();

        let error;

        try {
          await wrapper.vm.unpin(ITEM_ID, ENTITY_ID);
        } catch (e) {
          error = e;
        }

        expect(error?.message).toBe('Not Found');
      });
    });

    describe('when an EntityBestItemsSet for the entity is found', () => {
      beforeEach(() => {
        $nuxt.context.$apis.set.search.resolves({ total: 1, items: [ENTITY_ITEMS_BEST_SET_ID] });
      });

      it('deletes the item from the EntityBestItemsSet', async() => {
        const wrapper = factory();

        await wrapper.vm.unpin(ITEM_ID, ENTITY_ID);

        expect($nuxt.context.$apis.set.deleteItems.calledWith(ENTITY_ITEMS_BEST_SET_ID, ITEM_ID)).toBe(true);
      });

      it('makes toast to announce deletion', async() => {
        const wrapper = factory();

        await wrapper.vm.unpin(ITEM_ID, ENTITY_ID);

        expect(makeToastSpy.calledWith('entity.notifications.unpinned')).toBe(true);
      });
    });
  });
});
