import { createLocalVue, mount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import VueI18n from 'vue-i18n';
import Vuex from 'vuex';
import flushPromises from 'flush-promises';
import EntityUpdateModal from '@/components/item/PinModal';
import sinon from 'sinon';

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

const defaultFeaturedSetIds = {
  'http://data.europeana.eu/agent/base/123': '456'
};

const setApiSearchStub = sinon.stub().resolves({});
const setApiCreateStub = sinon.stub().resolves({});
const setApiModifyItemsStub = sinon.stub().resolves({});
const entityApiFindStub = sinon.stub().resolves(defaultEntityFindResponse);

const itemPinnedToGetterStub = sinon.stub();
const itemAllRelatedEntitiesGetterStub = sinon.stub();
const itemAddPinToFeaturedSetPinsMutationStub = sinon.stub();

import messages from '@/lang/en';

const i18n = new VueI18n({
  locale: 'en',
  messages: {
    en: messages
  }
});

const store = new Vuex.Store({
  state: {
    item: {
      id: '/123/abc',
      annotations: [],
      relatedEntities: [],
      allRelatedEntities: defaultEntityFindResponse,
      featuredSetIds: defaultFeaturedSetIds,
      featuredSetPins: {},
      similarItems: []
    }
  },
  mutations: {
    'item/addToFeaturedSetIds': sinon.stub(),
    'item/addPinToFeaturedSetPins': itemAddPinToFeaturedSetPinsMutationStub,
    'item/addToFeaturedSetPins': sinon.stub()
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
    $apis: {
      entity: {
        find: entityApiFindStub
      },
      set: {
        search: setApiSearchStub,
        create: setApiCreateStub,
        modifyItems: setApiModifyItemsStub
      },
      ...apiOverrides
    }
  }
});

describe('components/item/PinModal', () => {
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
      it('shows the check icon on the selected optoion', () => {
        const wrapper = factory();
        wrapper.setData({ selected: 'http://data.europeana.eu/agent/base/123' });
        // pending
      });
    });
    describe('when an option is pinned', () => {
      it('shows the pin icon on the pinned optoion', () => {
        // pending
      });
    });
  });

  describe('toggle pin button', () => {
    describe('on success', () => {
      describe('when unpinning', () => {
        it('makes a toast', async() => {
          itemPinnedToGetterStub.returns(true);
          const wrapper = factory();
          await wrapper.setData({ selected: 'http://data.europeana.eu/agent/base/123' });

          const rootBvToast = sinon.spy(wrapper.vm.$root.$bvToast, 'toast');

          await wrapper.find('[data-qa="toggle pin button"]').trigger('click').then(() => {
            expect(rootBvToast.calledWith('The item has been unpinned. We will notify you when this change will be visible on the collection page.', sinon.match.any)).toBe(true); //
          });
        });
      });

      describe('when pinning', () => {
        it('makes a toast', async() => {
          itemPinnedToGetterStub.returns(false);
          const wrapper = factory();
          await wrapper.setData({ selected: 'http://data.europeana.eu/agent/base/123' });

          const rootBvToast = sinon.spy(wrapper.vm.$root.$bvToast, 'toast');

          await wrapper.find('[data-qa="toggle pin button"]').trigger('click').then(async() => {
            await flushPromises();
            expect(rootBvToast.calledWith('The item has been pinned. It will appear as the first item on the "Agent entity" collection. We will notify you when this change will be visible on the collection page.', sinon.match.any)).toBe(true); //
          });
        });
      });
    });

    describe('when there is NO existing set', () => {
      it('creates a set and pins the item', async() => {
        const wrapper = factory();
        wrapper.setData({ selected: 'http://data.europeana.eu/agent/base/123' });

        // Setup state for no set.

        await wrapper.find('[data-qa="toggle pin button"]').trigger('click');

        // pending
      });
    });

    describe('when there is an existing set', () => {
      describe('when the selected entity does NOT have the item pinned', () => {
        it('updates the set to add the item', async() => {
          const wrapper = factory();
          wrapper.setData({ selected: 'http://data.europeana.eu/agent/base/123' });

          // Setup state for existing set.

          await wrapper.find('[data-qa="toggle pin button"]').trigger('click');

          // pending
        });
      });
      describe('when the selected entity does has the item pinned already', () => {
        it('updates the set to remove the item', async() => {
          const wrapper = factory();
          wrapper.setData({ selected: 'http://data.europeana.eu/agent/base/123' });

          // Setup state for eisting set with pinned item.

          await wrapper.find('[data-qa="toggle pin button"]').trigger('click');

          // pending
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
        // pending
      });
    });

    describe('fetchFeaturedSetData', () => {
      it('itterates over all entityIds and searches the set API for relevant sets', async() => {
        // pending
      });
      describe('when there are no sets for any of the entities', () => {
        it('does NOT set anything in the store', async() => {
          // Should this actually be RESETTING the store to empty values?
          // pending
        });
      });
      describe('when an entity has an associated EntityBestItemsSet set', () => {
        it('sets the EntityBestItemsSet id in the store', async() => {
          // pending
        });
        describe('when there are pinned items present', () => {
          it('sets the FeaturedSetPins in the store', async() => {
            // pending
          });
        });
        describe('when there are NO pinned items present', () => {
          it('sets the FeaturedSetPins in the store to be empty', async() => {
            // pending
          });
        });
      });
    });

    describe('ensureSelectedSetExists', () => {
      describe('when there is NO set in the store', () => {
        it('sends a create request to the set API', async() => {
          // pending
        });
      });
      describe('when there is a set in the store', () => {
        it('does NOT send any create request to the set API', async() => {
          // pending
        });
      });
    });

    describe('pin', () => {
      it('ensures there is a selected set', async() => {
        // pending
      });
      describe('when when the item can be pinned', () => {
        it('updates the store, closes the modal, and makes a toast', async() => {
          // pending
        });
      });
      describe('when when the item can NOT be pinned', () => {
        describe('because the set is full', () => {
          it('closes the modal, makes a new modal to say the entity set is full', async() => {
            // pending
          });
        });
        describe('because of another error', () => {
          it('??? this just throws the error ??? How should this be handled?', async() => {
            // pending
          });
        });
      });
    });
    describe('unpin', () => {
      describe('when the deletion works', () => {
        it('updates the featuredSetData, closes the modal, and makes a toast', async() => {
          // pending
        });
      });
    });
    describe('selectEntity', () => {
      it('sets the entity to the passed value', async() => {
      });
    });
    describe('togglePin', () => {
      describe('when the selected entity does not contain the item', () => {
        it('calls the pin method', async() => {
          itemPinnedToGetterStub.returns(false); // double check this doesn't need to be reset.
          const wrapper = factory();
          wrapper.setData({ selected: 'http://data.europeana.eu/agent/base/123' });

          const pinMock = sinon.mock(wrapper.vm).expects('pin').once();

          await wrapper.vm.togglePin();

          expect(pinMock.verify()).toBe(true);
        });
      });

      describe('when the selected entity has the current item pinned', () => {
        it('calls the unpin method', async() => {
          itemPinnedToGetterStub.returns(true); // double check this doesn't need to be reset.
          const wrapper = factory();
          wrapper.setData({ selected: 'http://data.europeana.eu/agent/base/123' });

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
