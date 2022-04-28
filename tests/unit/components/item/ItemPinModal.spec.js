import { createLocalVue, mount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import VueI18n from 'vue-i18n';
import EntityUpdateModal from '@/components/item/ItemPinModal';
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

const defaultEntityFindResponse = [
  {
    id: 'http://data.europeana.eu/agent/base/123',
    prefLabel: { en: 'Agent entity' }
  },
  {
    id: 'http://data.europeana.eu/topic/base/123',
    prefLabel: { en: 'Topic entity' }
  },
  {
    id: 'http://data.europeana.eu/organisation/base/123456789',
    prefLabel: { en: 'Organisation entity' }
  }
];

const setSearchApiResponse = {
  data: {
    total: 1,
    items: ['http://data.europeana.eu/set/456']
  }
};

const setGetApiResponseWithPinnedItem = {
  id: 'http://data.europeana.eu/set/456',
  type: 'EntityBestItemsSet',
  subject: ['http://data.europeana.eu/agent/base/123'],
  pinned: 1,
  items: ['http://data.europeana.eu/item/123/abc']
};

const defaultFeaturedSetIds = {
  'http://data.europeana.eu/agent/base/123': '456'
};

const fullPins = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24'];

const setApiGetStub = sinon.stub().resolves(setGetApiResponseWithPinnedItem);
const setApiSearchStub = sinon.stub().resolves({});
const setApiCreateStub = sinon.stub().resolves({ id: '457' });
const setApiModifyItemsStub = sinon.stub().resolves({});
const entityApiFindStub = sinon.stub().resolves(defaultEntityFindResponse);

import messages from '@/lang/en';

const i18n = new VueI18n({
  locale: 'en',
  messages: {
    en: messages
  }
});

const defaultPropsData = {
  entities: [
    'http://data.europeana.eu/agent/base/123',
    'http://data.europeana.eu/topic/base/123',
    'http://data.europeana.eu/organisation/base/123456789'
  ]
};

const factory = (propsData = defaultPropsData, apiOverrides = {}) => mount(EntityUpdateModal, {
  localVue,
  propsData: {
    identifier: '/123/abc',
    modalStatic: true,
    modalId: 'pin-modal-/123/abc',
    ...propsData
  },
  i18n,
  mocks: {
    $path: () => {},
    $apis: {
      entity: {
        find: entityApiFindStub
      },
      set: {
        get: setApiGetStub,
        search: setApiSearchStub,
        create: setApiCreateStub,
        modifyItems: setApiModifyItemsStub
      },
      ...apiOverrides
    }
  }
});

describe('components/item/ItemPinModal', () => {
  afterEach(async() => {
    sinon.resetHistory();
  });

  describe('while NO entity is selected', () => {
    it('disables the pin button', () => {
      const wrapper = factory();
      wrapper.setData({ selected: null });

      expect(wrapper.find('[data-qa="toggle pin button"]').attributes('disabled')).toBe('disabled');
    });
  });

  describe('option buttons', () => {
    it('show a button for each entity option', async() => {
      const wrapper = factory();
      await wrapper.setData({
        allRelatedEntities: defaultEntityFindResponse
      });

      expect(wrapper.findAll('button[data-qa="pin item to entity choice"]').length).toEqual(3);
    });

    describe('when an option is selected', () => {
      it('shows the check icon on the selected option', async() => {
        const wrapper = factory();
        await wrapper.setData({
          selected: 'http://data.europeana.eu/agent/base/123',
          allRelatedEntities: defaultEntityFindResponse
        });
        const button = wrapper.find('button[data-qa="pin item to entity choice"]');

        expect(button.find('span.icon-check-circle').exists()).toEqual(true);
      });
    });
    describe('when an option is pinned', () => {
      it('shows the pin icon on the pinned option', async() => {
        const wrapper = factory();
        await wrapper.setData({
          featuredSetPins: {
            'http://data.europeana.eu/agent/base/123': ['/123/abc']
          },
          allRelatedEntities: defaultEntityFindResponse
        });

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
        it('notifies about unpinning', async() => {
          // itemPinnedToGetterStub.returns(true);
          const wrapper = factory();

          await wrapper.setData({ selected: 'http://data.europeana.eu/agent/base/123' });

          const helpSpan = wrapper.find('span.help');
          expect(helpSpan.exists()).toBe(true);
          expect(helpSpan.text()).toBe('This item will stop showing at the top of the "Agent entity" collection. We will notify you when this change will be visible on the collection page.');
        });
      });
      describe('while the item not yet pinned', () => {
        it('notifies about pinning', async() => {
          // itemPinnedToGetterStub.returns(false);
          const wrapper = factory();

          await wrapper.setData({ selected: 'http://data.europeana.eu/agent/base/123' });

          const helpSpan = wrapper.find('span.help');
          expect(helpSpan.exists()).toBe(true);
          expect(helpSpan.text()).toBe('This item will show at the top of the "Agent entity" collection. We will notify you when this change will be visible on the collection page.');
        });
      });
      describe('while the selected set is full', () => {
        describe('while the item is already pinned', () => {
          it('notifies about unpinning', async() => {
            const wrapper = factory({ identifier: fullPins[0] });

            await wrapper.setData({
              selected: 'http://data.europeana.eu/agent/base/123',
              featuredSetPins: {
                'http://data.europeana.eu/agent/base/123': fullPins
              }
            });

            const helpSpan = wrapper.find('span.help');
            expect(helpSpan.exists()).toBe(true);
            expect(helpSpan.text()).toBe('This item will stop showing at the top of the "Agent entity" collection. We will notify you when this change will be visible on the collection page.');
          });
        });

        describe('while the item not yet pinned', () => {
          it('notifies about unpinning', async() => {
            // itemPinnedToGetterStub.returns(false);
            const wrapper = factory();

            await wrapper.setData({
              selected: 'http://data.europeana.eu/agent/base/123',
              featuredSetPins: {
                'http://data.europeana.eu/agent/base/123': fullPins
              }
            });

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
        it('exists and is enabled', async() => {
          const wrapper = factory({ identifier: fullPins[0] });

          await wrapper.setData({
            selected: 'http://data.europeana.eu/agent/base/123',
            featuredSetPins: {
              'http://data.europeana.eu/agent/base/123': fullPins
            }
          });

          const button = wrapper.find('[data-qa="toggle pin button"]:enabled');
          expect(button.exists()).toBe(true);
          expect(button.text()).toBe('Unpin item');
        });
      });
      describe('while the item NOT pinned', () => {
        it('is not shown', async() => {
          const wrapper = factory();
          await wrapper.setData({
            selected: 'http://data.europeana.eu/agent/base/123',
            featuredSetPins: {
              'http://data.europeana.eu/agent/base/123': fullPins
            }
          });

          expect(wrapper.find('[data-qa="toggle pin button"]').exists()).toBe(false);
        });
      });
    });
    describe('when clicked', () => {
      describe('when pinning', () => {
        it('makes a toast', async() => {
          const wrapper = factory();
          await wrapper.setData({
            selected: 'http://data.europeana.eu/agent/base/123',
            featuredSetPins: {
              'http://data.europeana.eu/agent/base/123': []
            }
          });

          const makeToast = sinon.spy(wrapper.vm, 'makeToast');

          await wrapper.find('[data-qa="toggle pin button"]').trigger('click');
          expect(makeToast.calledWith('The item has been pinned. It will appear as the first item on the "Agent entity" collection. We will notify you when this change will be visible on the collection page.', sinon.match.any)).toBe(true);
        });
      });

      describe('when unpinning', () => {
        it('makes a toast', async() => {
          const wrapper = factory();
          await wrapper.setData({
            selected: 'http://data.europeana.eu/agent/base/123',
            featuredSetPins: {
              'http://data.europeana.eu/agent/base/123': ['/123/abc']
            }
          });

          const makeToast = sinon.spy(wrapper.vm, 'makeToast');

          await wrapper.find('[data-qa="toggle pin button"]').trigger('click');
          expect(makeToast.calledWith('The item has been unpinned. We will notify you when this change will be visible on the collection page.', sinon.match.any)).toBe(true);
        });
      });
    });

    describe('when there is NO existing set', () => {
      it('creates a set and pins the item, updates the store', async() => {
        // itemPinnedToGetterStub.returns(false);
        const wrapper = factory();
        await wrapper.setData({
          selected: 'http://data.europeana.eu/agent/base/123',
          featuredSetIds: {}
        });

        await wrapper.find('[data-qa="toggle pin button"]').trigger('click');
        expect(setApiCreateStub.called).toBe(true);
        expect(setApiModifyItemsStub.called).toBe(true);
      });
    });

    describe('when there is an existing set', () => {
      describe('when the selected entity does NOT have the item pinned', () => {
        it('updates the set to add the item', async() => {
          // itemPinnedToGetterStub.returns(false);
          const wrapper = factory();
          await wrapper.setData({
            selected: 'http://data.europeana.eu/agent/base/123',
            featuredSetPins: {},
            featuredSetIds: defaultFeaturedSetIds
          });

          await  wrapper.find('[data-qa="toggle pin button"]').trigger('click');

          expect(setApiModifyItemsStub.called).toBe(true);

          expect(setApiCreateStub.called).toBe(false);
        });
      });
      describe('when the selected entity has the item pinned already', () => {
        it('updates the set to remove the item, then refetches the set', async() => {
          // itemPinnedToGetterStub.returns(true);
          setApiSearchStub.resolves(setSearchApiResponse);
          const wrapper = factory();
          await wrapper.setData({
            selected: 'http://data.europeana.eu/agent/base/123',
            featuredSetIds: defaultFeaturedSetIds,
            featuredSetPins: {
              'http://data.europeana.eu/agent/base/123': ['/123/abc']
            }
          });

          await  wrapper.find('[data-qa="toggle pin button"]').trigger('click');

          expect(setApiModifyItemsStub.called).toBe(true);
          expect(setApiSearchStub.called).toBe(true);
          expect(setApiCreateStub.called).toBe(false);
        });
      });
    });
  });

  describe('go to set link', () => {
    describe('while the selected set is full', () => {
      describe('while the item is already pinned', () => {
        it('does not exist', async() => {
          // itemPinnedToGetterStub.returns(true);
          // store.state.item.featuredSetPins['http://data.europeana.eu/agent/base/123'] = fullPins;
          const wrapper = factory();

          await wrapper.setData({ selected: 'http://data.europeana.eu/agent/base/123' });

          const button = wrapper.find('[data-qa="go to set link"]');
          expect(button.exists()).toBe(false);
        });
      });
      describe('while the item NOT pinned', () => {
        it('is shown', async() => {
          const wrapper = factory();
          await wrapper.setData({
            selected: 'http://data.europeana.eu/agent/base/123',
            featuredSetPins: {
              'http://data.europeana.eu/agent/base/123': fullPins
            },
            fetched: true,
            allRelatedEntities: defaultEntityFindResponse
          });

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
      wrapper.setData({ selected: 'http://data.europeana.eu/agent/base/123' });
      const bvModalHide = sinon.spy(wrapper.vm.$bvModal, 'hide');

      const cancelButton = wrapper.find('[data-qa="cancel button"]');

      cancelButton.trigger('click');

      expect(wrapper.vm.selected).toBeNull();
      expect(bvModalHide.calledWith('pin-modal-/123/abc')).toBe(true);
    });
  });

  describe('methods', () => {
    describe('fetchPinningData', () => {
      it('fetches the entities and triggers retrieval of the featuredSetData, then sets fetched to true', async() => {
        const wrapper = factory();
        const fetchFeaturedSetDataMock = sinon.mock(wrapper.vm).expects('fetchFeaturedSetData').once().withArgs(defaultPropsData.entities);

        await wrapper.vm.fetchPinningData();

        expect(entityApiFindStub.calledWith(sinon.match.array.deepEquals(defaultPropsData.entities))).toBe(true);
        expect(fetchFeaturedSetDataMock.verify()).toBe(true);
        expect(wrapper.vm.fetched).toBe(true);
      });
    });

    describe('fetchFeaturedSetData', () => {
      afterEach(() => {
        setApiSearchStub.resolves(setSearchApiResponse);
      });
      it('itterates over all entityIds and searches the set API for relevant sets', async() => {
        const wrapper = factory();

        await wrapper.vm.fetchFeaturedSetData(defaultPropsData.entities);

        expect(setApiSearchStub.callCount).toBe(3);
      });
      describe('when there are no sets for any of the entities', () => {
        it('does NOT call "getSetData"', async() => {
          setApiSearchStub.resolves({ data: { total: 0 } });
          const wrapper = factory();
          const getSetDataMock = sinon.mock(wrapper.vm).expects('getSetData').never();

          await wrapper.vm.fetchFeaturedSetData(defaultPropsData.entities);

          expect(setApiSearchStub.callCount).toBe(3);
          expect(getSetDataMock.verify()).toBe(true);
        });
      });
      describe('when an entity has an associated EntityBestItemsSet set', () => {
        it('calls "getSetData" for the setId', async() => {
          setApiSearchStub.resolves(setSearchApiResponse);
          const wrapper = factory();
          const getSetDataMock = sinon.mock(wrapper.vm).expects('getSetData').thrice().withArgs('456');

          await wrapper.vm.fetchFeaturedSetData(defaultPropsData.entities);

          expect(getSetDataMock.verify()).toBe(true);
        });
      });
    });

    describe('getSetData', () => {
      afterEach(() => {
        setApiGetStub.resolves(setGetApiResponseWithPinnedItem);
      });
      describe('when there are NO pinned items present', () => {
        it('stores the set ID and blank array of pins', async() => {
          const setGetResponse = {
            id: 'http://data.europeana.eu/set/456',
            type: 'EntityBestItemsSet',
            subject: ['http://data.europeana.eu/agent/base/123'],
            pinned: 0
          };
          setApiGetStub.resolves(setGetResponse);

          const wrapper = factory();

          await wrapper.vm.getSetData('456');

          expect(setApiGetStub.calledWith('456', {
            profile: 'standard',
            pageSize: 100
          })).toBe(true);
          expect(wrapper.vm.featuredSetIds).toEqual({
            'http://data.europeana.eu/agent/base/123': '456'
          });
          expect(wrapper.vm.featuredSetPins).toEqual({
            'http://data.europeana.eu/agent/base/123': []
          });
        });
      });
      describe('when there are pinned items present', () => {
        it('stores the set ID and pins', async() => {
          const wrapper = factory();

          await wrapper.vm.fetchFeaturedSetData(defaultPropsData.entities);

          expect(setApiGetStub.calledWith('456', {
            profile: 'standard',
            pageSize: 100
          })).toBe(true);
          expect(wrapper.vm.featuredSetIds).toEqual({
            'http://data.europeana.eu/agent/base/123': '456'
          });
          expect(wrapper.vm.featuredSetPins).toEqual({
            'http://data.europeana.eu/agent/base/123': ['/123/abc']
          });
        });
      });
    });

    describe('ensureSelectedSetExists', () => {
      describe('when there is NO set in the store', () => {
        it('sends a create request to the set API, updates the data', async() => {
          const wrapper = factory();
          await wrapper.setData({
            selected: 'http://data.europeana.eu/agent/base/123',
            featuredSetIds: {},
            allRelatedEntities: defaultEntityFindResponse
          });

          await wrapper.vm.ensureSelectedSetExists();

          expect(setApiCreateStub.calledWith({
            type: 'EntityBestItemsSet',
            title: { 'en': 'Agent entity Page' },
            subject: ['http://data.europeana.eu/agent/base/123']
          })).toBe(true);
          expect(wrapper.vm.featuredSetIds).toEqual({
            'http://data.europeana.eu/agent/base/123': '457'
          });
          expect(wrapper.vm.featuredSetPins).toEqual({
            'http://data.europeana.eu/agent/base/123': []
          });
        });
      });

      describe('when there is a set in the store', () => {
        it('does NOT send any create request to the set API', async() => {
          const wrapper = factory();
          await wrapper.setData({
            selected: 'http://data.europeana.eu/agent/base/123',
            featuredSetIds: defaultFeaturedSetIds
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
          selected: 'http://data.europeana.eu/agent/base/123',
          featuredSetIds: {
            'http://data.europeana.eu/agent/base/123': '456'
          },
          featuredSetPins: {
            'http://data.europeana.eu/agent/base/123': []
          }
        });
        const ensureSelectedSetExistsMock = sinon.mock(wrapper.vm).expects('ensureSelectedSetExists').once();

        await wrapper.vm.pin();

        expect(ensureSelectedSetExistsMock.verify()).toBe(true);
      });

      describe('when when the item can be pinned', () => {
        it('adds the pin on the set Api, updates the data, hides the modal', async() => {
          const wrapper = factory();
          await wrapper.setData({
            selected: 'http://data.europeana.eu/agent/base/123',
            featuredSetIds: {
              'http://data.europeana.eu/agent/base/123': '456'
            },
            featuredSetPins: {
              'http://data.europeana.eu/agent/base/123': []
            }
          });
          const hideMock = sinon.mock(wrapper.vm).expects('hide').once();

          await wrapper.vm.pin();

          expect(setApiModifyItemsStub.calledWith('add', '456', '/123/abc', true)).toBe(true);
          expect(wrapper.vm.featuredSetPins).toEqual({
            'http://data.europeana.eu/agent/base/123': ['/123/abc']
          });
          expect(hideMock.verify()).toBe(true);
        });
      });
    });

    describe('unpin', () => {
      describe('when the deletion works', () => {
        it('sends delte to the set API, re-retrieves the featuredSetData, hides the modal', async() => {
          setApiSearchStub.resolves(setSearchApiResponse);
          const wrapper = factory();
          await wrapper.setData({
            selected: 'http://data.europeana.eu/agent/base/123',
            featuredSetIds: defaultFeaturedSetIds,
            featuredSetPins: {
              'http://data.europeana.eu/agent/base/123': ['/123/abc']
            }
          });
          const hideMock = sinon.mock(wrapper.vm).expects('hide').once();

          await wrapper.vm.unpin();

          expect(setApiModifyItemsStub.calledWith('delete', '456', '/123/abc')).toBe(true);
          expect(setApiSearchStub.called).toBe(true);
          expect(hideMock.verify()).toBe(true);
        });
      });
    });

    describe('selectEntity', () => {
      it('sets the entity to the passed value', async() => {
        const wrapper = factory();
        await wrapper.setData({ selected: null });

        await wrapper.vm.selectEntity('http://data.europeana.eu/agent/base/123');

        expect(wrapper.vm.selected).toEqual('http://data.europeana.eu/agent/base/123');
      });
    });

    describe('togglePin', () => {
      describe('when the selected entity does not contain the item', () => {
        it('calls the pin method', async() => {
          // itemPinnedToGetterStub.returns(false);
          const wrapper = factory();
          await wrapper.setData({ selected: 'http://data.europeana.eu/agent/base/123' });

          const pinMock = sinon.mock(wrapper.vm).expects('pin').once();

          await wrapper.vm.togglePin();

          expect(pinMock.verify()).toBe(true);
        });
      });

      describe('when the selected entity has the current item pinned', () => {
        it('calls the unpin method', async() => {
          // itemPinnedToGetterStub.returns(true);
          const wrapper = factory();
          await wrapper.setData({
            selected: 'http://data.europeana.eu/agent/base/123',
            featuredSetPins: {
              'http://data.europeana.eu/agent/base/123': ['/123/abc']
            }
          });

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
