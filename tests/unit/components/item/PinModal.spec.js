import { createLocalVue, mount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import VueI18n from 'vue-i18n';
import Vuex from 'vuex';
import flushPromises from 'flush-promises';
import EntityUpdateModal from '@/components/item/PinModal';
import sinon from 'sinon';

/*
** The pin modal has a lot of store and API dependencies.
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
localVue.use(Vuex);

const defaultEntityFindResponse = [
  {
    id: 'http://data.europeana.eu/agent/base/123',
    prefLabel: { en: 'Agent entity' }
  },
  {
    id: 'http://data.europeana.eu/topic/base/123',
    prefLabel: { en: 'Topic entity' },
    isShownBy: 'https://example.org/topic/depiction.jpg'
  },
  {
    id: 'http://data.europeana.eu/organisation/base/123456789',
    prefLabel: { en: 'Organisation entity' },
    logo: 'https://example.org/organisation/logo.jpg'
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

const itemPinnedToGetterStub = sinon.stub();
const itemAllRelatedEntitiesGetterStub = sinon.stub();
const itemSetAllRelatedEntitiesMutationStub = sinon.stub();
const itemAddToFeaturedSetIdsMutationStub = sinon.stub();
const itemAddPinToFeaturedSetPinsMutationStub = sinon.stub();
const itemAddToFeaturedSetPinsMutationStub = sinon.stub();

import messages from '@/lang/en';

const i18n = new VueI18n({
  locale: 'en',
  messages: {
    en: messages
  }
});

const initialStoreState = {
  item: {
    id: '/123/abc',
    annotations: [],
    relatedEntities: [],
    allRelatedEntities: defaultEntityFindResponse,
    featuredSetIds: defaultFeaturedSetIds,
    featuredSetPins: {},
    similarItems: []
  }
};

const store = new Vuex.Store({
  state: initialStoreState,
  mutations: {
    'item/setAllRelatedEntities': itemSetAllRelatedEntitiesMutationStub,
    'item/addToFeaturedSetIds': itemAddToFeaturedSetIdsMutationStub,
    'item/addPinToFeaturedSetPins': itemAddPinToFeaturedSetPinsMutationStub,
    'item/addToFeaturedSetPins': itemAddToFeaturedSetPinsMutationStub
  },
  getters: {
    'item/id': () => '/123/abc',
    'item/pinnedTo': () => itemPinnedToGetterStub
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
  store,
  propsData: {
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

describe('components/item/PinModal', () => {
  afterEach(async() => {
    setApiSearchStub.resetHistory();
    setApiCreateStub.resetHistory();
    setApiModifyItemsStub.resetHistory();
    entityApiFindStub.resetHistory();

    itemPinnedToGetterStub.resetHistory();
    itemAllRelatedEntitiesGetterStub.resetHistory();
    itemSetAllRelatedEntitiesMutationStub.resetHistory();
    itemAddToFeaturedSetIdsMutationStub.resetHistory();
    itemAddPinToFeaturedSetPinsMutationStub.resetHistory();
    itemAddToFeaturedSetPinsMutationStub.resetHistory();
  });

  describe('while NO entity is selected', () => {
    it('disables the pin button', () => {
      const wrapper = factory();
      wrapper.setData({ selected: null });

      expect(wrapper.find('[data-qa="toggle pin button"]').attributes('disabled')).toBe('disabled');
    });
  });

  describe('option buttons', () => {
    it('show a button for each entity option', () => {
      itemAllRelatedEntitiesGetterStub.returns(defaultEntityFindResponse);
      const wrapper = factory();

      expect(wrapper.findAll('button[data-qa="pin item to entity choice"]').length).toEqual(3);
    });

    describe('when an option is selected', () => {
      it('shows the check icon on the selected option', async() => {
        const wrapper = factory();
        await wrapper.setData({ selected: 'http://data.europeana.eu/agent/base/123' });
        const button = wrapper.find('button[data-qa="pin item to entity choice"]');

        expect(button.find('span.icon-check-circle').exists()).toEqual(true);
      });
    });
    describe('when an option is pinned', () => {
      it('shows the pin icon on the pinned option', () => {
        itemPinnedToGetterStub.returns(true);
        const wrapper = factory();
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
        expect(helpSpan.text()).toBe('Select a related entity to pin/unpin the Item to/from it.');
      });
    });

    describe('while an item is selected', () => {
      afterEach(() => {
        itemPinnedToGetterStub.returns(true); // deafault setup
      });
      describe('while the item is already pinned', () => {
        it('notifies about unpinning', async() => {
          itemPinnedToGetterStub.returns(true);
          const wrapper = factory();

          await wrapper.setData({ selected: 'http://data.europeana.eu/agent/base/123' });

          const helpSpan = wrapper.find('span.help');
          expect(helpSpan.exists()).toBe(true);
          expect(helpSpan.text()).toBe('This item will stop showing at the top of the "Agent entity" collection. We will notify you when this change will be visible on the collection page.');
        });
      });
      describe('while the item not yet pinned', () => {
        it('notifies about pinning', async() => {
          itemPinnedToGetterStub.returns(false);
          const wrapper = factory();

          await wrapper.setData({ selected: 'http://data.europeana.eu/agent/base/123' });

          const helpSpan = wrapper.find('span.help');
          expect(helpSpan.exists()).toBe(true);
          expect(helpSpan.text()).toBe('This item will show at the top of the "Agent entity" collection. We will notify you when this change will be visible on the collection page.');
        });
      });
      describe('while the selected set is full', () => {
        afterEach(() => {
          store.state.item.featuredSetPins = {};
        });
        describe('while the item is already pinned', () => {
          it('notifies about unpinning', async() => {
            itemPinnedToGetterStub.returns(true);
            store.state.item.featuredSetPins['http://data.europeana.eu/agent/base/123'] = fullPins;
            const wrapper = factory();

            await wrapper.setData({ selected: 'http://data.europeana.eu/agent/base/123' });

            const helpSpan = wrapper.find('span.help');
            expect(helpSpan.exists()).toBe(true);
            expect(helpSpan.text()).toBe('This item will stop showing at the top of the "Agent entity" collection. We will notify you when this change will be visible on the collection page.');
          });
        });

        describe('while the item not yet pinned', () => {
          it('notifies about unpinning', async() => {
            itemPinnedToGetterStub.returns(false);
            store.state.item.featuredSetPins['http://data.europeana.eu/agent/base/123'] = fullPins;
            const wrapper = factory();

            await wrapper.setData({ selected: 'http://data.europeana.eu/agent/base/123' });

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
      afterEach(() => {
        store.state.item.featuredSetPins = {};
      });
      describe('while the item is already pinned', () => {
        it('exsists and is enabled', async() => {
          itemPinnedToGetterStub.returns(true);
          store.state.item.featuredSetPins['http://data.europeana.eu/agent/base/123'] = fullPins;
          const wrapper = factory();

          await wrapper.setData({ selected: 'http://data.europeana.eu/agent/base/123' });

          const button = wrapper.find('[data-qa="toggle pin button"]:enabled');
          expect(button.exists()).toBe(true);
          expect(button.text()).toBe('Unpin item');
        });
      });
      describe('while the item NOT pinned', () => {
        it('is not shown', async() => {
          itemPinnedToGetterStub.returns(false);
          store.state.item.featuredSetPins['http://data.europeana.eu/agent/base/123'] = fullPins;
          const wrapper = factory();
          await wrapper.setData({ selected: 'http://data.europeana.eu/agent/base/123' });

          expect(wrapper.find('[data-qa="toggle pin button"]').exists()).toBe(false);
        });
      });
    });
    describe('when clicked', () => {
      describe('when pinning', () => {
        it('makes a toast', async() => {
          itemPinnedToGetterStub.returns(false);
          const wrapper = factory();
          await wrapper.setData({ selected: 'http://data.europeana.eu/agent/base/123' });

          const rootBvToast = sinon.spy(wrapper.vm.$root.$bvToast, 'toast');

          await wrapper.find('[data-qa="toggle pin button"]').trigger('click');
          await flushPromises();
          expect(rootBvToast.calledWith('The item has been pinned. It will appear as the first item on the "Agent entity" collection. We will notify you when this change will be visible on the collection page.', sinon.match.any)).toBe(true);
        });
      });

      describe('when unpinning', () => {
        it('makes a toast', async() => {
          itemPinnedToGetterStub.returns(true);
          const wrapper = factory();
          await wrapper.setData({ selected: 'http://data.europeana.eu/agent/base/123' });

          const rootBvToast = sinon.spy(wrapper.vm.$root.$bvToast, 'toast');

          await wrapper.find('[data-qa="toggle pin button"]').trigger('click').then(() => {
            expect(rootBvToast.calledWith('The item has been unpinned. We will notify you when this change will be visible on the collection page.', sinon.match.any)).toBe(true);
          });
        });
      });
    });

    describe('when there is NO existing set', () => {
      it('creates a set and pins the item, updates the store', async() => {
        itemPinnedToGetterStub.returns(false);
        const wrapper = factory();
        await wrapper.setData({ selected: 'http://data.europeana.eu/agent/base/123' });

        wrapper.vm.$store.state.item.featuredSetIds = {};

        await wrapper.find('[data-qa="toggle pin button"]').trigger('click');
        await flushPromises();
        expect(setApiCreateStub.called).toBe(true);
        expect(setApiModifyItemsStub.called).toBe(true);
        expect(itemAddToFeaturedSetIdsMutationStub.called).toBe(true);
        expect(itemAddToFeaturedSetPinsMutationStub.called).toBe(true);
        expect(itemAddPinToFeaturedSetPinsMutationStub.called).toBe(true);
      });
    });

    describe('when there is an existing set', () => {
      describe('when the selected entity does NOT have the item pinned', () => {
        it('updates the set to add the item', async() => {
          itemPinnedToGetterStub.returns(false);
          const wrapper = factory();
          await wrapper.setData({ selected: 'http://data.europeana.eu/agent/base/123' });
          wrapper.vm.$store.state.item.featuredSetPins = {};
          wrapper.vm.$store.state.item.featuredSetIds = defaultFeaturedSetIds; // reset, for controlled state

          await  wrapper.find('[data-qa="toggle pin button"]').trigger('click');
          await flushPromises();

          expect(setApiModifyItemsStub.called).toBe(true);
          expect(itemAddPinToFeaturedSetPinsMutationStub.called).toBe(true);

          expect(setApiCreateStub.called).toBe(false);
          expect(itemAddToFeaturedSetIdsMutationStub.called).toBe(false);
          expect(itemAddToFeaturedSetPinsMutationStub.called).toBe(false);
        });
      });
      describe('when the selected entity has the item pinned already', () => {
        it('updates the set to remove the item, then refetches the set', async() => {
          itemPinnedToGetterStub.returns(true);
          setApiSearchStub.resolves(setSearchApiResponse);
          const wrapper = factory();
          await wrapper.setData({ selected: 'http://data.europeana.eu/agent/base/123' });
          wrapper.vm.$store.state.item.featuredSetIds = defaultFeaturedSetIds;
          wrapper.vm.$store.state.item.featuredSetPins = {
            'http://data.europeana.eu/agent/base/123': ['/123/abc']
          };

          await  wrapper.find('[data-qa="toggle pin button"]').trigger('click');
          await flushPromises();

          expect(setApiModifyItemsStub.called).toBe(true);
          expect(setApiSearchStub.called).toBe(true);
          expect(itemAddToFeaturedSetIdsMutationStub.called).toBe(true);
          expect(itemAddToFeaturedSetPinsMutationStub.called).toBe(true);

          expect(setApiCreateStub.called).toBe(false);
          expect(itemAddPinToFeaturedSetPinsMutationStub.called).toBe(false);
        });
      });
    });
  });

  describe('go to set link', () => {
    describe('while the selected set is full', () => {
      afterEach(() => {
        store.state.item.featuredSetPins = {};
      });
      describe('while the item is already pinned', () => {
        it('does not exist', async() => {
          itemPinnedToGetterStub.returns(true);
          store.state.item.featuredSetPins['http://data.europeana.eu/agent/base/123'] = fullPins;
          const wrapper = factory();

          await wrapper.setData({ selected: 'http://data.europeana.eu/agent/base/123' });

          const button = wrapper.find('[data-qa="go to set link"]');
          expect(button.exists()).toBe(false);
        });
      });
      describe('while the item NOT pinned', () => {
        it('is shown', async() => {
          itemPinnedToGetterStub.returns(false);
          store.state.item.featuredSetPins['http://data.europeana.eu/agent/base/123'] = fullPins;
          const wrapper = factory();
          await wrapper.setData({ selected: 'http://data.europeana.eu/agent/base/123' });

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

        await flushPromises();

        expect(entityApiFindStub.calledWith(sinon.match.array.deepEquals(defaultPropsData.entities))).toBe(true);
        expect(itemSetAllRelatedEntitiesMutationStub.calledWith(sinon.match.any, sinon.match.array)).toBe(true);
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

        await flushPromises();

        expect(setApiSearchStub.callCount).toBe(3);
      });
      describe('when there are no sets for any of the entities', () => {
        it('does NOT call "getSetData"', async() => {
          setApiSearchStub.resolves({ data: { total: 0 } });
          const wrapper = factory();
          const getSetDataMock = sinon.mock(wrapper.vm).expects('getSetData').never();

          await wrapper.vm.fetchFeaturedSetData(defaultPropsData.entities);

          await flushPromises();

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
        it('adds the featured setId and sets the FeaturedSetPins in the store to be empty', async() => {
          const setGetResponse = {
            id: 'http://data.europeana.eu/set/456',
            type: 'EntityBestItemsSet',
            subject: ['http://data.europeana.eu/agent/base/123'],
            pinned: 0
          };
          setApiGetStub.resolves(setGetResponse);

          const wrapper = factory();

          await wrapper.vm.getSetData('456');

          await flushPromises();

          expect(setApiGetStub.calledWith('456', {
            profile: 'standard',
            pageSize: 100
          })).toBe(true);
          expect(itemAddToFeaturedSetIdsMutationStub.calledWith(sinon.match.any, {
            entityUri: 'http://data.europeana.eu/agent/base/123',
            setId: '456'
          })).toBe(true);
          expect(itemAddToFeaturedSetPinsMutationStub.calledWith(sinon.match.any, {
            entityUri: 'http://data.europeana.eu/agent/base/123',
            pins: []
          })).toBe(true);
        });
      });
      describe('when there Are pinned items present', () => {
        it('sets the FeaturedSetPins in the store to be empty', async() => {
          const wrapper = factory();

          await wrapper.vm.fetchFeaturedSetData(defaultPropsData.entities);

          await flushPromises();

          expect(setApiGetStub.calledWith('456', {
            profile: 'standard',
            pageSize: 100
          })).toBe(true);
          expect(itemAddToFeaturedSetIdsMutationStub.calledWith(sinon.match.any, {
            entityUri: 'http://data.europeana.eu/agent/base/123',
            setId: '456'
          })).toBe(true);
          expect(itemAddToFeaturedSetPinsMutationStub.calledWith(sinon.match.any, {
            entityUri: 'http://data.europeana.eu/agent/base/123',
            pins: ['/123/abc']
          })).toBe(true);
        });
      });
    });

    describe('ensureSelectedSetExists', () => {
      describe('when there is NO set in the store', () => {
        afterEach(() => {
          store.state.item.featuredSetIds = defaultFeaturedSetIds;
        });
        it('sends a create request to the set API, updates the store', async() => {
          const wrapper = factory();
          await wrapper.setData({ selected: 'http://data.europeana.eu/agent/base/123' });
          wrapper.vm.$store.state.item.featuredSetIds = {};

          await wrapper.vm.ensureSelectedSetExists();

          await flushPromises();

          expect(setApiCreateStub.calledWith({
            type: 'EntityBestItemsSet',
            title: { 'en': 'Agent entity Page' },
            subject: ['http://data.europeana.eu/agent/base/123']
          })).toBe(true);
          expect(itemAddToFeaturedSetIdsMutationStub.calledWith(sinon.match.any, {
            entityUri: 'http://data.europeana.eu/agent/base/123',
            setId: '457'
          })).toBe(true);
          expect(itemAddToFeaturedSetPinsMutationStub.calledWith(sinon.match.any, {
            entityUri: 'http://data.europeana.eu/agent/base/123',
            pins: []
          })).toBe(true);
        });
      });

      describe('when there is a set in the store', () => {
        it('does NOT send any create request to the set API', async() => {
          const wrapper = factory();
          await wrapper.setData({ selected: 'http://data.europeana.eu/agent/base/123' });
          wrapper.vm.$store.state.item.featuredSetIds = defaultFeaturedSetIds;

          await wrapper.vm.ensureSelectedSetExists();

          await flushPromises();

          expect(setApiCreateStub.called).toBe(false);
          expect(itemAddToFeaturedSetIdsMutationStub.called).toBe(false);
          expect(itemAddToFeaturedSetPinsMutationStub.called).toBe(false);
        });
      });
    });

    describe('pin', () => {
      it('ensures there is a selected set', async() => {
        const wrapper = factory();
        await wrapper.setData({ selected: 'http://data.europeana.eu/agent/base/123' });
        const ensureSelectedSetExistsMock = sinon.mock(wrapper.vm).expects('ensureSelectedSetExists').once();

        await  wrapper.vm.pin();

        expect(ensureSelectedSetExistsMock.verify()).toBe(true);
      });

      describe('when when the item can be pinned', () => {
        it('adds the pin on the set Api, updates the store, hides the modal', async() => {
          const wrapper = factory();
          await wrapper.setData({ selected: 'http://data.europeana.eu/agent/base/123' });
          const hideMock = sinon.mock(wrapper.vm).expects('hide').once();

          await  wrapper.vm.pin();

          expect(setApiModifyItemsStub.calledWith('add', '456', '/123/abc', true)).toBe(true);

          // Update store expectations.
          expect(itemAddPinToFeaturedSetPinsMutationStub.called).toBe(true);

          expect(hideMock.verify()).toBe(true);
        });
      });
    });

    describe('unpin', () => {
      describe('when the deletion works', () => {
        it('sends delte to the set API, re-retrieves the featuredSetData, hides the modal', async() => {
          setApiSearchStub.resolves(setSearchApiResponse);
          const wrapper = factory();
          await wrapper.setData({ selected: 'http://data.europeana.eu/agent/base/123' });
          wrapper.vm.$store.state.item.featuredSetIds = defaultFeaturedSetIds;
          wrapper.vm.$store.state.item.featuredSetPins = {
            'http://data.europeana.eu/agent/base/123': ['/123/abc']
          };
          const hideMock = sinon.mock(wrapper.vm).expects('hide').once();

          await  wrapper.vm.unpin();
          await flushPromises();

          expect(setApiModifyItemsStub.calledWith('delete', '456', '/123/abc')).toBe(true);

          // expectations for: Re-fetch and update store.
          expect(setApiSearchStub.called).toBe(true);
          expect(itemAddToFeaturedSetIdsMutationStub.called).toBe(true);
          expect(itemAddToFeaturedSetPinsMutationStub.called).toBe(true);

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
          itemPinnedToGetterStub.returns(false);
          const wrapper = factory();
          await wrapper.setData({ selected: 'http://data.europeana.eu/agent/base/123' });

          const pinMock = sinon.mock(wrapper.vm).expects('pin').once();

          await wrapper.vm.togglePin();

          expect(pinMock.verify()).toBe(true);
        });
      });

      describe('when the selected entity has the current item pinned', () => {
        it('calls the unpin method', async() => {
          itemPinnedToGetterStub.returns(true);
          const wrapper = factory();
          await wrapper.setData({ selected: 'http://data.europeana.eu/agent/base/123' });

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
