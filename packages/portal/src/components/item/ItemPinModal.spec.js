import { createLocalVue, mount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import sinon from 'sinon';

import ItemPinModal from './ItemPinModal.vue';
import { fixtures, ENTITY_URI } from './ItemPinModal.fixtures.js';
import * as usePinnedItemsModule from '@/composables/pinnedItems';

/*
** The pin modal has a lot of API dependencies.
** This test file stubs a lot of these and by default instantiates a minimal 'happy path'.
** This means there will be:
** - An item present
** - Three related entities for that item in the propsData
** - Three related entities returned by a stubbed API find request
** - One BestBets set (correlating to the first related entity), but always returned when a set is retrieved
** - One pinned item (correlating to the main item) present in the bestBets set.
**
** Some specs may ovveride/stub/modify or use alterante values at differnt points,
** but should then restore this main path after completion.
**
** All stub call histories are reset after each block, for simplicity and to
** allow reusing the same stubs.
*/

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const setSearchApiResponse = {
  total: 1,
  items: ['http://data.europeana.eu/set/456']
};

const setGetApiResponseWithPinnedItem = {
  id: 'http://data.europeana.eu/set/456',
  type: 'EntityBestItemsSet',
  subject: [ENTITY_URI],
  pinned: 1,
  items: ['http://data.europeana.eu/item/123/abc']
};

const entityApiFindResponse = [
  {
    id: ENTITY_URI,
    prefLabel: { en: ['Agent entity'] }
  },
  {
    id: 'http://data.europeana.eu/topic/123',
    prefLabel: { en: ['Topic entity'] }
  },
  {
    id: 'http://data.europeana.eu/organisation/123456789',
    prefLabel: { en: ['Organisation entity'] }
  }
];

const entityApiFindStub = sinon.stub().resolves(entityApiFindResponse);
const setApiGetStub = sinon.stub().resolves(setGetApiResponseWithPinnedItem);
const setApiGetItemIdsStub = sinon.stub().resolves(['http://data.europeana.eu/item/123/abc']);
const setApiSearchStub = sinon.stub().resolves(setSearchApiResponse);
const setApiCreateStub = sinon.stub().resolves({ id: '457' });
const setApiPinItemStub = sinon.stub().resolves({});
const setApiDeleteItemStub = sinon.stub().resolves({});

const factory = ({ propsData, data, provide } = {}) => mount(ItemPinModal, {
  localVue,
  propsData: {
    identifier: '/123/abc',
    modalStatic: true,
    modalId: 'pin-modal-/123/abc',
    entityUris: [
      ENTITY_URI,
      'http://data.europeana.eu/topic/123',
      'http://data.europeana.eu/organisation/123456789'
    ],
    ...propsData
  },
  data,
  mocks: {
    localePath: () => {},
    $apis: {
      entity: {
        find: entityApiFindStub
      },
      set: {
        get: setApiGetStub,
        getItemIds: setApiGetItemIdsStub,
        search: setApiSearchStub,
        create: setApiCreateStub,
        deleteItems: setApiDeleteItemStub,
        pinItem: setApiPinItemStub
      }
    },
    $error: (error) => {
      console.error(error);
      throw error;
    },
    $i18n: { locale: 'en' },
    $t: (key) => key
  },
  provide
});

describe('components/item/ItemPinModal', () => {
  const pinSpy = sinon.spy();
  const unpinSpy = sinon.spy();
  sinon.stub(usePinnedItemsModule, 'usePinnedItems').returns({
    pin: pinSpy,
    unpin: unpinSpy
  });

  afterEach(sinon.resetHistory);
  afterAll(sinon.restore);

  describe('template', () => {
    describe('while NO entity is selected', () => {
      it('disables the pin button', () => {
        const wrapper = factory();

        expect(wrapper.find('[data-qa="toggle pin button"]').attributes('disabled')).toBe('disabled');
      });
    });

    describe('option buttons', () => {
      it('shows a button for each entity option', async() => {
        const wrapper = factory();
        await wrapper.vm.fetchData();

        expect(wrapper.findAll('button[data-qa="pin item to entity choice"]').length).toEqual(3);
      });

      describe('when an option is selected', () => {
        it('shows the check icon on the selected option', async() => {
          const wrapper = factory();
          await wrapper.vm.fetchData();
          await wrapper.setData({
            selected: ENTITY_URI
          });
          const button = wrapper.find('button[data-qa="pin item to entity choice"]');

          expect(button.find('span.icon-check-circle').exists()).toEqual(true);
        });
      });
      describe('when an option is pinned', () => {
        it('shows the pin icon on the pinned option', async() => {
          const wrapper = factory(fixtures.itemAlreadyPinned);
          await wrapper.vm.fetchData();

          const button = wrapper.find('button[data-qa="pin item to entity choice"]');

          expect(button.find('span.icon-pin').exists()).toEqual(true);
        });
      });
    });

    describe('info/help text', () => {
      describe('while no entity is selected', () => {
        it('notifies that an entity needs to be selected', async() => {
          const wrapper = factory();

          await wrapper.setData({ selected: null });
          const helpSpan = wrapper.find('span.help');

          expect(helpSpan.exists()).toBe(true);
          expect(helpSpan.text()).toBe('entity.notifications.select');
        });
      });

      describe('while an item is selected', () => {
        describe('while the item is already pinned', () => {
          it('notifies about unpinning', () => {
            const wrapper = factory(fixtures.itemAlreadyPinned);

            const helpSpan = wrapper.find('span.help');

            expect(helpSpan.exists()).toBe(true);
            expect(helpSpan.text()).toBe('entity.notifications.unpin');
          });
        });

        describe('while the item not yet pinned', () => {
          it('notifies about pinning', () => {
            const wrapper = factory(fixtures.itemNotPinned);

            const helpSpan = wrapper.find('span.help');

            expect(helpSpan.exists()).toBe(true);
            expect(helpSpan.text()).toBe('entity.notifications.pin');
          });
        });

        describe('while the selected set is full', () => {
          describe('while the item is already pinned', () => {
            it('notifies about unpinning', async() => {
              const wrapper = factory(fixtures.itemAlreadyPinnedInFullSet);

              const helpSpan = wrapper.find('span.help');

              expect(helpSpan.exists()).toBe(true);
              expect(helpSpan.text()).toBe('entity.notifications.unpin');
            });
          });

          describe('while the item not yet pinned', () => {
            it('notifies about unpinning', () => {
              const wrapper = factory(fixtures.itemNotPinnedInFullSet);

              const helpSpan = wrapper.find('span.help');

              expect(helpSpan.exists()).toBe(true);
              expect(helpSpan.text()).toBe('entity.notifications.pinLimit.body');
            });
          });
        });
      });
    });

    describe('toggle pin button', () => {
      describe('while the selected set is full', () => {
        describe('while the item is already pinned', () => {
          it('exists and is enabled', () => {
            const wrapper = factory(fixtures.itemAlreadyPinnedInFullSet);

            const button = wrapper.find('[data-qa="toggle pin button"]:enabled');
            expect(button.exists()).toBe(true);

            expect(button.text()).toBe('entity.actions.unpin');
          });
        });

        describe('while the item NOT pinned', () => {
          it('is not shown', () => {
            const wrapper = factory(fixtures.itemNotPinnedInFullSet);

            expect(wrapper.find('[data-qa="toggle pin button"]').exists()).toBe(false);
          });
        });
      });

      describe('when there is NO existing set', () => {
        it('pins the item via usePinnedItems composable', () => {
          const wrapper = factory(fixtures.setDoesNotExist);

          wrapper.find('[data-qa="toggle pin button"]').trigger('click');

          expect(pinSpy.calledWith(
            fixtures.setDoesNotExist.propsData.identifier,
            ENTITY_URI
          )).toBe(true);
        });
      });

      describe('when there is an existing set', () => {
        describe('when the selected entity does NOT have the item pinned', () => {
          it('pins the item via usePinnedItems composable', () => {
            const wrapper = factory(fixtures.itemNotPinned);

            wrapper.find('[data-qa="toggle pin button"]').trigger('click');

            expect(pinSpy.called).toBe(true);
          });
        });

        describe('when the selected entity has the item pinned already', () => {
          it('unpins the item via usePinnedItems composable', () => {
            const wrapper = factory(fixtures.itemAlreadyPinned);

            wrapper.find('[data-qa="toggle pin button"]').trigger('click');

            expect(unpinSpy.called).toBe(true);
          });
        });
      });
    });

    describe('go to set link', () => {
      describe('while the selected set is full', () => {
        describe('while the item is already pinned', () => {
          it('does not exist', () => {
            const wrapper = factory(fixtures.itemAlreadyPinnedInFullSet);

            const button = wrapper.find('[data-qa="go to set link"]');
            expect(button.exists()).toBe(false);
          });
        });

        describe('while the item NOT pinned', () => {
          it('is shown', () => {
            const wrapper = factory(fixtures.itemNotPinnedInFullSet);

            const button = wrapper.find('[data-qa="go to set link"]');
            expect(button.exists()).toBe(true);

            expect(button.text()).toBe('entity.actions.viewPinned');
          });
        });
      });
    });

    describe('cancel button', () => {
      it('hides the modal and unselects any entities', () => {
        const wrapper = factory();
        const bvModalHide = sinon.spy(wrapper.vm.$bvModal, 'hide');

        const cancelButton = wrapper.find('[data-qa="cancel button"]');

        cancelButton.trigger('click');

        expect(wrapper.vm.selected).toBeNull();
        expect(bvModalHide.calledWith('pin-modal-/123/abc')).toBe(true);
      });
    });
  });

  describe('methods', () => {
    describe('fetchData', () => {
      afterEach(() => {
        setApiSearchStub.resolves(setSearchApiResponse);
      });

      it('fetches and stores the entities from the Entity API', async() => {
        const wrapper = factory();

        await wrapper.vm.fetchData();

        expect(entityApiFindStub.called).toBe(true);
        expect(wrapper.vm.entities).toEqual(entityApiFindResponse);
      });

      it('iterates over all entityIds and searches the set API for relevant sets', async() => {
        const wrapper = factory();

        await wrapper.vm.fetchData();

        expect(setApiSearchStub.callCount).toBe(3);
      });

      it('sets `fetched` to `true`', async() => {
        const wrapper = factory();

        await wrapper.vm.fetchData();

        expect(wrapper.vm.fetched).toBe(true);
      });
    });

    describe('selectEntity', () => {
      it('sets the entity to the passed value', async() => {
        const wrapper = factory();
        await wrapper.setData({ selected: null });

        await wrapper.vm.selectEntity(ENTITY_URI);

        expect(wrapper.vm.selected).toEqual(ENTITY_URI);
      });
    });

    describe('togglePin', () => {
      describe('when the selected entity does not contain the item', () => {
        it('calls the pin method', async() => {
          const wrapper = factory(fixtures.itemNotPinned);

          const hideMock = sinon.mock(wrapper.vm).expects('hide').once();

          await wrapper.vm.togglePin();

          expect(pinSpy.called).toBe(true);
          expect(hideMock.verify()).toBe(true);
        });
      });

      describe('when the selected entity has the current item pinned', () => {
        it('calls the unpin method', async() => {
          const wrapper = factory(fixtures.itemAlreadyPinned);

          await wrapper.vm.togglePin();

          expect(unpinSpy.called).toBe(true);
        });
      });
    });

    describe('hide', () => {
      it('hides the modal and unsets "selected"', async() => {
        const wrapper = factory();
        const bvModalHide = sinon.spy(wrapper.vm.$bvModal, 'hide');

        await wrapper.vm.hide();

        expect(bvModalHide.calledWith('pin-modal-/123/abc')).toBe(true);
        expect(wrapper.vm.selected).toBeNull();
      });
    });

    describe('entityDisplayLabel', () => {
      describe('when there is an english prefLabel', () => {
        const entityWithEnglishPrefLabel = {
          id: ENTITY_URI,
          prefLabel: { en: ['English label', 'another Label'], fr: ['French label'] }
        };
        it('uses the first english pref label value', async() => {
          const wrapper = factory();

          const result = await wrapper.vm.entityDisplayLabel(entityWithEnglishPrefLabel);

          expect(result.values[0]).toBe('English label');
        });
      });

      describe('when there is NO english prefLabel', () => {
        const entityWithFrenchPrefLabel = {
          id: ENTITY_URI,
          prefLabel: { fr: ['French label'] }
        };
        it('uses the first prefLabel value of an available language', async() => {
          const wrapper = factory();

          const result = await wrapper.vm.entityDisplayLabel(entityWithFrenchPrefLabel);

          expect(result.values[0]).toBe('French label');
        });
      });
    });
  });
});
