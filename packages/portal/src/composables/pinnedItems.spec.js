import sinon from 'sinon';

import * as useMakeToastModule from '@/composables/makeToast';
import { usePinnedItems } from './pinnedItems.js';

import { createLocalVue, shallowMount } from '@vue/test-utils';

const component = {
  template: '<span />',
  setup() {
    const { off, on, pin, unpin } = usePinnedItems();
    return { off, on, pin, unpin };
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

  it('creates a $pinnedItems instance on the root', () => {
    const wrapper = factory();

    expect(typeof wrapper.vm.$root.$pinnedItems).toBe('object');
    expect(typeof wrapper.vm.$root.$pinnedItems.pin).toBe('function');
    expect(typeof wrapper.vm.$root.$pinnedItems.unpin).toBe('function');
  });

  describe('pin', () => {
    beforeEach(() => {
      $nuxt.context.$apis.entity.retrieve.resolves([{ id: ENTITY_ID, prefLabel: { en: 'Entity' } }]);
      $nuxt.context.$apis.set.search.resolves({ total: 1, items: [ENTITY_ITEMS_BEST_SET_ID] });
    });

    it('retrieves the full entity data', async() => {
      const wrapper = factory();

      await wrapper.vm.pin(ITEM_ID, ENTITY_ID);

      expect($nuxt.context.$apis.entity.retrieve.calledWith([ENTITY_ID])).toBe(true);
    });

    describe('when no such entity is found', () => {
      beforeEach(() => {
        $nuxt.context.$apis.entity.retrieve.resolves([]);
      });

      it('throws a PinnedItemsError', async() => {
        const wrapper = factory();

        let error;

        try {
          await wrapper.vm.pin(ITEM_ID, ENTITY_ID);
        } catch (e) {
          error = e;
        }

        expect(error.name).toBe('PinnedItemsError');
        expect(error.message).toBe('Entity not found');
      });
    });

    describe('when the entity is found', () => {
      beforeEach(() => {
        $nuxt.context.$apis.entity.retrieve.resolves([{ id: ENTITY_ID, prefLabel: { en: 'Entity' } }]);
      });

      it('searches for an EntityBestItemsSet for the entity', async() => {
        const wrapper = factory();

        await wrapper.vm.pin(ITEM_ID, ENTITY_ID);

        expect($nuxt.context.$apis.set.search.calledWith({
          profile: 'items',
          query: 'type:EntityBestItemsSet',
          qf: `subject:${ENTITY_ID}`
        })).toBe(true);
      });
    });

    describe('when no EntityBestItemsSet for the entity is found', () => {
      beforeEach(() => {
        $nuxt.context.$apis.set.search.resolves({ total: 0 });
        $nuxt.context.$apis.set.create.resolves({ id: ENTITY_ITEMS_BEST_SET_ID });
      });

      it('creates an EntityBestItemsSet for the entity', async() => {
        const wrapper = factory();

        await wrapper.vm.pin(ITEM_ID, ENTITY_ID);

        expect($nuxt.context.$apis.set.create.calledWith({
          type: 'EntityBestItemsSet',
          title: {
            en: 'Entity'
          },
          subject: [ENTITY_ID]
        })).toBe(true);
      });

      it('pins the item to the set', async() => {
        const wrapper = factory();

        await wrapper.vm.pin(ITEM_ID, ENTITY_ID);

        expect($nuxt.context.$apis.set.pinItem.calledWith(ENTITY_ITEMS_BEST_SET_ID, ITEM_ID)).toBe(true);
      });

      it('makes toast to announce pinning', async() => {
        const wrapper = factory();

        await wrapper.vm.pin(ITEM_ID, ENTITY_ID);

        expect(makeToastSpy.calledWith('entity.notifications.pinned')).toBe(true);
      });

      it('dispatches a pin event', async() => {
        const wrapper = factory();
        const unpinListener = sinon.spy();
        wrapper.vm.on('pin', unpinListener);

        await wrapper.vm.pin(ITEM_ID, ENTITY_ID);

        expect(unpinListener.calledWith(sinon.match((event) => {
          return event.type === 'pin' && event.itemId === ITEM_ID && event.entityId === ENTITY_ID;
        }))).toBe(true);
      });
    });

    describe('when an EntityBestItemsSet for the entity is found', () => {
      beforeEach(() => {
        $nuxt.context.$apis.set.search.resolves({ total: 1, items: [ENTITY_ITEMS_BEST_SET_ID] });
        $nuxt.context.$apis.set.requestSet.resolves({ pinned: 0 });
      });

      it('fetches the full set', async() => {
        const wrapper = factory();

        await wrapper.vm.pin(ITEM_ID, ENTITY_ID);

        expect($nuxt.context.$apis.set.requestSet.calledWith(ENTITY_ITEMS_BEST_SET_ID)).toBe(true);
      });

      describe('when the set has 24 pinned items already', () => {
        beforeEach(() => {
          $nuxt.context.$apis.set.requestSet.resolves({ pinned: 24 });
        });

        it('does not pin the item to the set', async() => {
          const wrapper = factory();

          await wrapper.vm.pin(ITEM_ID, ENTITY_ID);

          expect($nuxt.context.$apis.set.pinItem.called).toBe(false);
        });

        it('shows an notification modal', async() => {
          const wrapper = factory();

          await wrapper.vm.pin(ITEM_ID, ENTITY_ID);

          expect($bvModal.show.calledWith(`pinned-limit-modal-${ITEM_ID}`)).toBe(true);
        });
      });

      describe('when the set does not yet have 24 pinned items', () => {
        beforeEach(() => {
          $nuxt.context.$apis.set.requestSet.resolves({ pinned: 10 });
        });

        it('pins the item to the set', async() => {
          const wrapper = factory();

          await wrapper.vm.pin(ITEM_ID, ENTITY_ID);

          expect($nuxt.context.$apis.set.pinItem.calledWith(ENTITY_ITEMS_BEST_SET_ID, ITEM_ID)).toBe(true);
        });

        it('makes toast to announce pinning', async() => {
          const wrapper = factory();

          await wrapper.vm.pin(ITEM_ID, ENTITY_ID);

          expect(makeToastSpy.calledWith('entity.notifications.pinned')).toBe(true);
        });

        it('dispatches a pin event', async() => {
          const wrapper = factory();
          const unpinListener = sinon.spy();
          wrapper.vm.on('pin', unpinListener);

          await wrapper.vm.pin(ITEM_ID, ENTITY_ID);

          expect(unpinListener.calledWith(sinon.match((event) => {
            return event.type === 'pin' && event.itemId === ITEM_ID && event.entityId === ENTITY_ID;
          }))).toBe(true);
        });
      });
    });
  });

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

      it('throws a PinnedItemsError', async() => {
        const wrapper = factory();

        let error;

        try {
          await wrapper.vm.unpin(ITEM_ID, ENTITY_ID);
        } catch (e) {
          error = e;
        }

        expect(error.name).toBe('PinnedItemsError');
        expect(error.message).toBe('EntityBestItemsSet not found');
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

      it('makes toast to announce unpinning', async() => {
        const wrapper = factory();

        await wrapper.vm.unpin(ITEM_ID, ENTITY_ID);

        expect(makeToastSpy.calledWith('entity.notifications.unpinned')).toBe(true);
      });

      it('dispatches an unpin event', async() => {
        const wrapper = factory();
        const unpinListener = sinon.spy();
        wrapper.vm.on('unpin', unpinListener);

        await wrapper.vm.unpin(ITEM_ID, ENTITY_ID);

        expect(unpinListener.calledWith(sinon.match((event) => {
          return event.type === 'unpin' && event.itemId === ITEM_ID && event.entityId === ENTITY_ID;
        }))).toBe(true);
      });
    });
  });
});
