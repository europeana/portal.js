import { createLocalVue, mount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import VueI18n from 'vue-i18n';
import ItemPinModal from '@/components/item/ItemPinModal';
import sinon from 'sinon';

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

// TODO: prevent b-toaster-bootm-left-dynamic re-regristration warning.
// Maybe caused by the toast being registered on localVue?
const localVue = createLocalVue();
localVue.use(BootstrapVue);
localVue.use(VueI18n);

const setSearchApiResponse = {
  data: {
    total: 1,
    items: ['http://data.europeana.eu/set/456']
  }
};

const ENTITY_URI = 'http://data.europeana.eu/agent/base/123';

const setGetApiResponseWithPinnedItem = {
  id: 'http://data.europeana.eu/set/456',
  type: 'EntityBestItemsSet',
  subject: [ENTITY_URI],
  pinned: 1,
  items: ['http://data.europeana.eu/item/123/abc']
};

const fullPins = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24'];

const fixtures = {
  itemAlreadyPinned: {
    propsData: { identifier: '/123/abc' },
    data: () => ({
      selected: ENTITY_URI,
      sets: {
        [ENTITY_URI]: { id: '456', pinned: ['/123/abc'] }
      }
    })
  },
  itemNotPinned: {
    propsData: { identifier: '/123/abc' },
    data: () => ({
      selected: ENTITY_URI,
      sets: {
        [ENTITY_URI]: { id: '456', pinned: [] }
      }
    })
  },
  itemAlreadyPinnedInFullSet: {
    propsData: { identifier: fullPins[0] },
    data: () => ({
      selected: ENTITY_URI,
      sets: {
        [ENTITY_URI]: { id: '456', pinned: fullPins }
      }
    })
  },
  itemNotPinnedInFullSet: {
    propsData: { identifier: '/123/abc' },
    data: () => ({
      selected: ENTITY_URI,
      sets: {
        [ENTITY_URI]: { id: '456', pinned: fullPins }
      }
    })
  },
  setDoesNotExist: {
    propsData: { identifier: '/123/abc' },
    data: () => ({
      selected: ENTITY_URI,
      sets: {
        [ENTITY_URI]: { id: null, pinned: [] }
      }
    })
  }
};

const setApiGetStub = sinon.stub().resolves(setGetApiResponseWithPinnedItem);
const setApiSearchStub = sinon.stub().resolves({});
const setApiCreateStub = sinon.stub().resolves({ id: '457' });
const setApiModifyItemsStub = sinon.stub().resolves({});

import messages from '@/lang/en';

const i18n = new VueI18n({
  locale: 'en',
  messages: {
    en: messages
  }
});

const factory = ({ propsData, data } = {}) => mount(ItemPinModal, {
  localVue,
  propsData: {
    identifier: '/123/abc',
    modalStatic: true,
    modalId: 'pin-modal-/123/abc',
    entities: [
      {
        about: ENTITY_URI,
        prefLabel: { en: ['Agent entity'] }
      },
      {
        about: 'http://data.europeana.eu/topic/base/123',
        prefLabel: { en: ['Topic entity'] }
      },
      {
        about: 'http://data.europeana.eu/organisation/base/123456789',
        prefLabel: { en: ['Organisation entity'] }
      }
    ],
    ...propsData
  },
  data,
  i18n,
  mocks: {
    $path: () => {},
    $apis: {
      set: {
        get: setApiGetStub,
        search: setApiSearchStub,
        create: setApiCreateStub,
        modifyItems: setApiModifyItemsStub
      }
    }
  }
});

describe('components/item/ItemPinModal', () => {
  afterEach(sinon.resetHistory);

  describe('template', () => {
    describe('while NO entity is selected', () => {
      it('disables the pin button', () => {
        const wrapper = factory();

        expect(wrapper.find('[data-qa="toggle pin button"]').attributes('disabled')).toBe('disabled');
      });
    });

    describe('option buttons', () => {
      it('show a button for each entity option', async() => {
        const wrapper = factory();

        expect(wrapper.findAll('button[data-qa="pin item to entity choice"]').length).toEqual(3);
      });

      describe('when an option is selected', () => {
        it('shows the check icon on the selected option', async() => {
          const wrapper = factory();
          await wrapper.setData({
            selected: ENTITY_URI
          });
          const button = wrapper.find('button[data-qa="pin item to entity choice"]');

          expect(button.find('span.icon-check-circle').exists()).toEqual(true);
        });
      });
      describe('when an option is pinned', () => {
        it('shows the pin icon on the pinned option', () => {
          const wrapper = factory(fixtures.itemAlreadyPinned);

          const button = wrapper.find('button[data-qa="pin item to entity choice"]');

          expect(button.find('span.icon-push-pin').exists()).toEqual(true);
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
          expect(helpSpan.text()).toBe('Select a related entity to pin/unpin the item to/from it.');
        });
      });

      describe('while an item is selected', () => {
        describe('while the item is already pinned', () => {
          it('notifies about unpinning', () => {
            const wrapper = factory(fixtures.itemAlreadyPinned);

            const helpSpan = wrapper.find('span.help');
            expect(helpSpan.exists()).toBe(true);
            expect(helpSpan.text()).toBe('This item will stop showing at the top of the "Agent entity" collection. We will notify you when this change will be visible on the collection page.');
          });
        });

        describe('while the item not yet pinned', () => {
          it('notifies about pinning', () => {
            const wrapper = factory(fixtures.itemNotPinned);

            const helpSpan = wrapper.find('span.help');
            expect(helpSpan.exists()).toBe(true);
            expect(helpSpan.text()).toBe('This item will show at the top of the "Agent entity" collection. We will notify you when this change will be visible on the collection page.');
          });
        });

        describe('while the selected set is full', () => {
          describe('while the item is already pinned', () => {
            it('notifies about unpinning', async() => {
              const wrapper = factory(fixtures.itemAlreadyPinnedInFullSet);

              const helpSpan = wrapper.find('span.help');
              expect(helpSpan.exists()).toBe(true);
              expect(helpSpan.text()).toBe('This item will stop showing at the top of the "Agent entity" collection. We will notify you when this change will be visible on the collection page.');
            });
          });

          describe('while the item not yet pinned', () => {
            it('notifies about unpinning', () => {
              const wrapper = factory(fixtures.itemNotPinnedInFullSet);

              const helpSpan = wrapper.find('span.help');
              expect(helpSpan.exists()).toBe(true);
              expect(helpSpan.text()).toBe('For now you can only pin 24 items. If you want to pin this item, make sure you unpin another one and try pinning this item again.');
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
            expect(button.text()).toBe('Unpin item');
          });
        });

        describe('while the item NOT pinned', () => {
          it('is not shown', () => {
            const wrapper = factory(fixtures.itemNotPinnedInFullSet);

            expect(wrapper.find('[data-qa="toggle pin button"]').exists()).toBe(false);
          });
        });
      });
      describe('when clicked', () => {
        describe('when pinning', () => {
          it('makes a toast', async() => {
            const wrapper = factory(fixtures.itemNotPinned);
            const makeToast = sinon.spy(wrapper.vm, 'makeToast');

            await wrapper.find('[data-qa="toggle pin button"]').trigger('click');
            await new Promise(process.nextTick);

            expect(makeToast.calledWith('The item has been pinned. It will appear as the first item on the "Agent entity" collection. We will notify you when this change will be visible on the collection page.')).toBe(true);
          });
        });

        describe('when unpinning', () => {
          it('makes a toast', async() => {
            const wrapper = factory(fixtures.itemAlreadyPinned);
            const makeToast = sinon.spy(wrapper.vm, 'makeToast');

            await wrapper.find('[data-qa="toggle pin button"]').trigger('click');

            expect(makeToast.calledWith('The item has been unpinned. We will notify you when this change will be visible on the collection page.')).toBe(true);
          });
        });
      });

      describe('when there is NO existing set', () => {
        it('creates a set and pins the item, updates the store', async() => {
          const wrapper = factory(fixtures.setDoesNotExist);

          await wrapper.find('[data-qa="toggle pin button"]').trigger('click');
          await new Promise(process.nextTick);
          expect(setApiCreateStub.called).toBe(true);
          expect(setApiModifyItemsStub.called).toBe(true);
        });
      });

      describe('when there is an existing set', () => {
        describe('when the selected entity does NOT have the item pinned', () => {
          it('updates the set to add the item', async() => {
            const wrapper = factory(fixtures.itemNotPinned);

            await wrapper.find('[data-qa="toggle pin button"]').trigger('click');

            expect(setApiModifyItemsStub.called).toBe(true);
            expect(setApiCreateStub.called).toBe(false);
          });
        });

        describe('when the selected entity has the item pinned already', () => {
          it('updates the set to remove the item', async() => {
            const wrapper = factory(fixtures.itemAlreadyPinned);

            await wrapper.find('[data-qa="toggle pin button"]').trigger('click');

            expect(setApiModifyItemsStub.called).toBe(true);
            expect(setApiCreateStub.called).toBe(false);
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
            expect(button.text()).toBe('See pinned items');
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
    describe('fetchEntityBestItemsSets', () => {
      afterEach(() => {
        setApiSearchStub.resolves(setSearchApiResponse);
      });

      it('iterates over all entityIds and searches the set API for relevant sets', async() => {
        const wrapper = factory();

        await wrapper.vm.fetchEntityBestItemsSets();

        expect(setApiSearchStub.callCount).toBe(3);
      });

      describe('when there are no sets for any of the entities', () => {
        it('does NOT call "getOneSet"', async() => {
          setApiSearchStub.resolves({ data: { total: 0 } });
          const wrapper = factory();
          const getOneSetMock = sinon.mock(wrapper.vm).expects('getOneSet').never();

          await wrapper.vm.fetchEntityBestItemsSets();

          expect(setApiSearchStub.callCount).toBe(3);
          expect(getOneSetMock.verify()).toBe(true);
        });
      });

      describe('when an entity has an associated EntityBestItemsSet set', () => {
        it('calls "getOneSet" for the setId', async() => {
          setApiSearchStub.resolves(setSearchApiResponse);
          const wrapper = factory();
          const getOneSetMock = sinon.mock(wrapper.vm).expects('getOneSet').thrice().withArgs('456');

          await wrapper.vm.fetchEntityBestItemsSets();

          expect(getOneSetMock.verify()).toBe(true);
        });
      });

      it('sets `fetched` to `true`', async() => {
        const wrapper = factory();

        await wrapper.vm.fetchEntityBestItemsSets();

        expect(wrapper.vm.fetched).toBe(true);
      });
    });

    describe('getOneSet', () => {
      afterEach(() => {
        setApiGetStub.resolves(setGetApiResponseWithPinnedItem);
      });

      describe('when there are NO pinned items present', () => {
        it('stores the set ID and blank array of pins', async() => {
          const setGetResponse = {
            id: 'http://data.europeana.eu/set/456',
            type: 'EntityBestItemsSet',
            subject: [ENTITY_URI],
            pinned: 0
          };
          setApiGetStub.resolves(setGetResponse);

          const wrapper = factory();

          await wrapper.vm.getOneSet('456');

          expect(setApiGetStub.calledWith('456', {
            profile: 'standard',
            pageSize: 100
          })).toBe(true);
          expect(wrapper.vm.sets[ENTITY_URI].id).toBe('456');
          expect(wrapper.vm.sets[ENTITY_URI].pinned).toEqual([]);
        });
      });

      describe('when there are pinned items present', () => {
        it('stores the set ID and pins', async() => {
          const wrapper = factory();

          await wrapper.vm.getOneSet('456');

          expect(setApiGetStub.calledWith('456', {
            profile: 'standard',
            pageSize: 100
          })).toBe(true);
          expect(wrapper.vm.sets[ENTITY_URI].id).toBe('456');
          expect(wrapper.vm.sets[ENTITY_URI].pinned).toEqual(['/123/abc']);
        });
      });
    });

    describe('ensureSelectedSetExists', () => {
      describe('when there is NO set ID stored', () => {
        it('sends a create request to the set API, updates the data', async() => {
          const wrapper = factory();
          await wrapper.setData({
            selected: ENTITY_URI,
            sets: {
              [ENTITY_URI]: { id: null, pinned: [] }
            }
          });

          await wrapper.vm.ensureSelectedSetExists();

          expect(setApiCreateStub.calledWith({
            type: 'EntityBestItemsSet',
            title: { 'en': 'Agent entity Page' },
            subject: [ENTITY_URI]
          })).toBe(true);
          expect(wrapper.vm.sets[ENTITY_URI].id).toBe('457');
          expect(wrapper.vm.sets[ENTITY_URI].pinned).toEqual([]);
        });
      });

      describe('when there is a set ID already stored', () => {
        it('does NOT send any create request to the set API', async() => {
          const wrapper = factory();
          await wrapper.setData({
            selected: ENTITY_URI,
            sets: {
              [ENTITY_URI]: { id: '456', pinned: [] }
            }
          });

          await wrapper.vm.ensureSelectedSetExists();

          expect(setApiCreateStub.called).toBe(false);
        });
      });
    });

    describe('pin', () => {
      it('ensures there is a selected set', async() => {
        const wrapper = factory();
        await wrapper.setData({
          selected: ENTITY_URI,
          sets: {
            [ENTITY_URI]: { id: '456', pinned: [] }
          }
        });
        const ensureSelectedSetExistsMock = sinon.mock(wrapper.vm).expects('ensureSelectedSetExists').once();

        await wrapper.vm.pin();

        expect(ensureSelectedSetExistsMock.verify()).toBe(true);
      });

      describe('when when the item can be pinned', () => {
        it('adds the pin on the set API, updates the data, hides the modal', async() => {
          const wrapper = factory();
          await wrapper.setData({
            selected: ENTITY_URI,
            sets: {
              [ENTITY_URI]: { id: '456', pinned: [] }
            }
          });
          const hideMock = sinon.mock(wrapper.vm).expects('hide').once();

          await wrapper.vm.pin();

          expect(setApiModifyItemsStub.calledWith('add', '456', '/123/abc', true)).toBe(true);
          expect(wrapper.vm.sets[ENTITY_URI].pinned).toEqual(['/123/abc']);
          expect(hideMock.verify()).toBe(true);
        });
      });
    });

    describe('unpin', () => {
      describe('when the deletion works', () => {
        it('sends delete to the set API, removes the item from local data, and hides the modal', async() => {
          const wrapper = factory(fixtures.itemAlreadyPinned);
          const hideMock = sinon.mock(wrapper.vm).expects('hide').once();

          await wrapper.vm.unpin();

          expect(setApiModifyItemsStub.calledWith('delete', '456', '/123/abc')).toBe(true);
          expect(wrapper.vm.sets[ENTITY_URI].pinned).toEqual([]);
          expect(hideMock.verify()).toBe(true);
        });
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
          const wrapper = factory();
          await wrapper.setData({ selected: ENTITY_URI });

          const pinMock = sinon.mock(wrapper.vm).expects('pin').once();

          await wrapper.vm.togglePin();

          expect(pinMock.verify()).toBe(true);
        });
      });

      describe('when the selected entity has the current item pinned', () => {
        it('calls the unpin method', async() => {
          const wrapper = factory(fixtures.itemAlreadyPinned);

          const unpinMock = sinon.mock(wrapper.vm).expects('unpin').once();

          await wrapper.vm.togglePin();

          expect(unpinMock.verify()).toBe(true);
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
  });
});
