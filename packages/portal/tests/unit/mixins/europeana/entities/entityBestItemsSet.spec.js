import { createLocalVue, shallowMount } from '@vue/test-utils';
import sinon from 'sinon';
import mixin from '@/mixins/europeana/entities/entityBestItemsSet';

const component = {
  template: '<div></div>',
  mixins: [mixin]
};

const localVue = createLocalVue();

const fixtures = {
  entityId: 'http://data.europeana.eu/concept/120120',
  englishPrefLabel: 'English',
  itemId: 'http://data.europeana.eu/item/123/abc',
  germanPrefLabel: 'Deutsch',
  setId: 'http://data.europeana.eu/set/120120',
  setNumber: '120120',
  setType: 'EntityBestItemsSet'
};
fixtures.entityPrefLabelScalars = {
  de: fixtures.germanPrefLabel,
  en: fixtures.englishPrefLabel
};
fixtures.entityPrefLabelArrays = {
  de: [fixtures.germanPrefLabel],
  en: [fixtures.englishPrefLabel]
};
fixtures.setTitle = {
  de: 'Deutsch',
  en: 'English'
};

const factory = () => {
  return shallowMount(component, {
    localVue,
    mocks: {
      $apis: {
        set: {
          create: sinon.stub().resolves({ id: fixtures.setId }),
          deleteItem: sinon.spy(),
          get: sinon.stub().resolves({ items: [fixtures.setId] }),
          pinItem: sinon.spy(),
          search: sinon.stub().resolves({})
        }
      },
      $bvModal: {
        show: sinon.spy()
      },
      $store: {
        commit: sinon.spy(),
        state: {
          entity: {
            pinned: []
          }
        }
      },
      $t: (key, values) => values?.entity ? `${key} ${values.entity}` : key,
      makeToast: sinon.spy()
    }
  });
};

describe('mixins/europeana/entities/entityBestItemsSet', () => {
  afterEach(sinon.resetHistory);

  describe('methods', () => {
    describe('ensureEntityBestItemsSetExists', () => {
      it('does not create EntityBestItemsSet if supplied set ID', async() => {
        const wrapper = factory();

        await wrapper.vm.ensureEntityBestItemsSetExists(fixtures.setId);

        expect(wrapper.vm.$apis.set.create.called).toBe(false);
      });

      it('creates an EntityBestItemsSet via the Set API, from entity id and scalar prefLabels', async() => {
        const wrapper = factory();

        await wrapper.vm.ensureEntityBestItemsSetExists(null, {
          id: fixtures.entityId,
          prefLabel: fixtures.entityPrefLabelScalars
        });

        expect(wrapper.vm.$apis.set.create.calledWith({
          type: fixtures.setType,
          title: fixtures.setTitle,
          subject: [fixtures.entityId]
        })).toBe(true);
      });

      it('creates an EntityBestItemsSet via the Set API, from entity about and array prefLabels', async() => {
        const wrapper = factory();

        await wrapper.vm.ensureEntityBestItemsSetExists(null, {
          about: fixtures.entityId,
          prefLabel: fixtures.entityPrefLabelArrays
        });

        expect(wrapper.vm.$apis.set.create.calledWith({
          type: fixtures.setType,
          title: fixtures.setTitle,
          subject: [fixtures.entityId]
        })).toBe(true);
      });

      it('returns the created set ID', async() => {
        const wrapper = factory();

        const setId = await wrapper.vm.ensureEntityBestItemsSetExists(null, {
          id: fixtures.entityId,
          prefLabel: fixtures.entityPrefLabelScalars
        });

        expect(setId).toBe(fixtures.setId);
      });
    });

    describe('findEntityBestItemsSet', () => {
      it('searches Set API for entity\'s EntityBestItemsSet', async() => {
        const wrapper = factory();

        await wrapper.vm.findEntityBestItemsSet(fixtures.entityId);

        expect(wrapper.vm.$apis.set.search.calledWith({
          query: 'type:EntityBestItemsSet',
          qf: `subject:${fixtures.entityId}`
        })).toBe(true);
      });

      it('returns the set\'s numeric ID if found', async() => {
        const wrapper = factory();
        wrapper.vm.$apis.set.search.resolves({
          total: 1,
          items: [fixtures.setId]
        });

        const setNumber = await wrapper.vm.findEntityBestItemsSet(fixtures.entityId);

        expect(setNumber).toBe(fixtures.setNumber);
      });

      it('returns `null` if not found', async() => {
        const wrapper = factory();
        wrapper.vm.$apis.set.search.resolves({
          total: 0
        });

        const setNumber = await wrapper.vm.findEntityBestItemsSet(fixtures.entityId);

        expect(setNumber).toBe(null);
      });
    });

    describe('fetchEntityBestItemsSetPinnedItems', () => {
      it('fetches EntityBestItemsSet from Set API', async() => {
        const wrapper = factory();

        await wrapper.vm.fetchEntityBestItemsSetPinnedItems(fixtures.entityId);

        expect(wrapper.vm.$apis.set.get.calledWith(fixtures.entityId, {
          profile: 'standard',
          pageSize: 100
        })).toBe(true);
      });

      it('stores pinned items if present', async() => {
        const wrapper = factory();
        wrapper.vm.$apis.set.get.resolves({ items: [fixtures.setId], pinned: 1 });

        await wrapper.vm.fetchEntityBestItemsSetPinnedItems(fixtures.entityId);

        expect(wrapper.vm.$store.commit.calledWith('entity/setPinned', [fixtures.setId])).toBe(true);
      });

      it('resets stored pinned items if none', async() => {
        const wrapper = factory();
        wrapper.vm.$apis.set.get.resolves({ items: [fixtures.setId], pinned: 0 });

        await wrapper.vm.fetchEntityBestItemsSetPinnedItems(fixtures.entityId);

        expect(wrapper.vm.$store.commit.calledWith('entity/setPinned', [])).toBe(true);
      });
    });

    describe('pinItemToEntityBestItemsSet', () => {
      it('re-fetches EntityBestItemsSet pinned items', async() => {
        const wrapper = factory();
        sinon.spy(wrapper.vm, 'fetchEntityBestItemsSetPinnedItems');

        await wrapper.vm.pinItemToEntityBestItemsSet(fixtures.itemId, fixtures.setId, fixtures.englishPrefLabel);

        expect(wrapper.vm.fetchEntityBestItemsSetPinnedItems.called).toBe(true);
      });

      describe('when there are already 24 or more pinned items', () => {
        const pinned = Array.from({ length: 24 }, (element, index) => {
          return `http://data.europeana.eu/item/123/${index + 1}`;
        });

        it('shows the pinned limit modal', async() => {
          const wrapper = factory();
          wrapper.vm.$store.state.entity.pinned = pinned;

          await wrapper.vm.pinItemToEntityBestItemsSet(fixtures.itemId, fixtures.setId, fixtures.englishPrefLabel);

          expect(wrapper.vm.$bvModal.show.calledWith(`pinned-limit-modal-${fixtures.itemId}`)).toBe(true);
        });

        it('does not modify the EntityBestItemsSet', async() => {
          const wrapper = factory();
          wrapper.vm.$store.state.entity.pinned = pinned;

          await wrapper.vm.pinItemToEntityBestItemsSet(fixtures.itemId, fixtures.setId, fixtures.englishPrefLabel);

          expect(wrapper.vm.$apis.set.pinItem.called).toBe(false);
        });
      });

      describe('when there are not yet 24 pinned items', () => {
        const pinned = Array.from({ length: 10 }, (element, index) => {
          return `http://data.europeana.eu/item/123/${index + 1}`;
        });

        it('adds the item to the EntityBestItemsSet', async() => {
          const wrapper = factory();
          wrapper.vm.$store.state.entity.pinned = pinned;

          await wrapper.vm.pinItemToEntityBestItemsSet(fixtures.itemId, fixtures.setId, fixtures.englishPrefLabel);

          expect(wrapper.vm.$apis.set.pinItem.calledWith(fixtures.setId, fixtures.itemId)).toBe(true);
        });

        it('makes toast with a notification', async() => {
          const wrapper = factory();
          wrapper.vm.$store.state.entity.pinned = pinned;

          await wrapper.vm.pinItemToEntityBestItemsSet(fixtures.itemId, fixtures.setId, fixtures.englishPrefLabel);

          expect(wrapper.vm.makeToast.calledWith(
            `entity.notifications.pinned ${fixtures.englishPrefLabel}`
          )).toBe(true);
        });
      });
    });

    describe('unpinItemFromEntityBestItemsSet', () => {
      it('removes the item from the EntityBestItemsSet', async() => {
        const wrapper = factory();

        await wrapper.vm.unpinItemFromEntityBestItemsSet(fixtures.itemId, fixtures.setId);

        expect(wrapper.vm.$apis.set.deleteItem.calledWith(
          fixtures.setId, fixtures.itemId
        )).toBe(true);
      });

      it('makes toast with a notification', async() => {
        const wrapper = factory();

        await wrapper.vm.unpinItemFromEntityBestItemsSet(fixtures.itemId, fixtures.setId);

        expect(wrapper.vm.makeToast.calledWith(
          'entity.notifications.unpinned'
        )).toBe(true);
      });
    });
  });
});
