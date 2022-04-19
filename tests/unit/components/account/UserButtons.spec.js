import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import UserButtons from '@/components/account/UserButtons';
import sinon from 'sinon';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const identifier = '/123/abc';
const storeDispatchSuccess = sinon.spy();
const storeIsLikedGetter = sinon.stub();
const storeIsPinnedGetter = sinon.stub();
const storeItemIdGetter = sinon.stub();
const makeToastSpy = sinon.spy();
const $goto = sinon.spy();
let storeEntityId = 'http://data.europeana.eu/topic/123';

const mixins = [
  {
    methods: {
      makeToast: makeToastSpy
    }
  }
];

const factory = ({ storeState = {},  $auth = {}, storeDispatch = storeDispatchSuccess } = {}) => shallowMount(UserButtons, {
  localVue,
  propsData: { identifier },
  mixins,
  mocks: {
    $auth,
    $goto,
    $matomo: {
      trackEvent: sinon.spy()
    },
    $path: () => 'mocked path',
    $store: {
      state: {
        set: { ...{ liked: [] }, ...storeState },
        entity: { ...{ pinned: [] }, ...storeState },
        item: { ...storeState }
      },
      getters: {
        'set/isLiked': storeIsLikedGetter,
        'entity/isPinned': storeIsPinnedGetter,
        'entity/id': storeEntityId,
        'item/id': storeItemIdGetter
      },
      dispatch: storeDispatch
    },
    $t: (key) => key,
    $i18n: { locale: 'en' }
  }
});

describe('components/account/UserButtons', () => {
  describe('collection modal', () => {
    it('is not present', () => {
      const wrapper = factory();

      const collectionModal = wrapper.find('[data-qa="collection modal"]');

      expect(collectionModal.exists()).toBe(false);
    });
  });

  describe('add button', () => {
    it('is visible', () => {
      const wrapper = factory();

      const addButton = wrapper.find('b-button-stub[data-qa="add button"]');

      expect(addButton.isVisible()).toBe(true);
    });

    describe('when user is not logged in', () => {
      const $auth = { loggedIn: false };

      describe('when pressed', () => {
        it('goes to login', () => {
          const wrapper = factory({ $auth });
          wrapper.vm.keycloakLogin = sinon.spy();

          const addButton = wrapper.find('b-button-stub[data-qa="add button"]');
          addButton.trigger('click');

          expect(wrapper.vm.keycloakLogin.called).toBe(true);
        });
      });
    });

    describe('when user is logged in', () => {
      const $auth = { loggedIn: true };

      describe('when pressed', () => {
        it('shows the collection modal', () => {
          const wrapper = factory({ $auth });
          const bvModalShow = sinon.spy(wrapper.vm.$bvModal, 'show');

          const addButton = wrapper.find('b-button-stub[data-qa="add button"]');
          addButton.trigger('click');

          expect(bvModalShow.calledWith(`add-item-to-set-modal-${identifier}`)).toBe(true);
        });

        it('emits "add" event', async() => {
          const wrapper = factory({ $auth });

          const addButton = wrapper.find('b-button-stub[data-qa="add button"]');
          addButton.trigger('click');

          await wrapper.vm.$nextTick();
          expect(wrapper.emitted('add')).toEqual([[identifier]]);
        });
      });
    });
  });

  describe('like button', () => {
    it('is visible', () => {
      const wrapper = factory();

      const likeButton = wrapper.find('b-button-stub[data-qa="like button"]');

      expect(likeButton.isVisible()).toBe(true);
    });
    it('does not contain text', () => {
      const wrapper = factory();

      const likeButton = wrapper.find('b-button-stub[data-qa="like button"]');

      expect(likeButton.text()).toBe('');
    });

    describe('when button with text', () => {
      it('contains text', async() => {
        const wrapper = factory();
        await wrapper.setProps({ buttonText: true });

        const likeButton = wrapper.find('b-button-stub[data-qa="like button"]');

        expect(likeButton.text()).toBe('actions.like');
      });
    });

    describe('when user is not logged in', () => {
      const $auth = { loggedIn: false };

      describe('when pressed', () => {
        it('goes to login', () => {
          const wrapper = factory({ $auth, storeState: { liked: [], likesId: null } });
          wrapper.vm.keycloakLogin = sinon.spy();

          const likeButton = wrapper.find('b-button-stub[data-qa="like button"]');
          likeButton.trigger('click');

          expect(wrapper.vm.keycloakLogin.called).toBe(true);
        });
      });
    });

    describe('when user is logged in', () => {
      const $auth = { loggedIn: true };

      describe('when an item is not yet liked', () => {
        beforeEach(() => {
          storeIsLikedGetter.reset();
          storeIsLikedGetter.returns(false);
        });

        describe('when pressed', () => {
          it('dispatches to create likes set if needed', () => {
            const wrapper = factory({ $auth, storeState: { liked: [], likesId: null } });

            const likeButton = wrapper.find('b-button-stub[data-qa="like button"]');
            likeButton.trigger('click');

            expect(storeDispatchSuccess.calledWith('set/createLikes')).toBe(true);
          });

          it('dispatches to add item to likes set', () => {
            const wrapper = factory({ $auth, storeState: { liked: [] } });

            const likeButton = wrapper.find('b-button-stub[data-qa="like button"]');
            likeButton.trigger('click');

            expect(storeDispatchSuccess.calledWith('set/like', identifier)).toBe(true);
          });

          it('emits "like" event', async() => {
            const wrapper = factory({ $auth, storeState: { liked: [] } });

            const likeButton = wrapper.find('b-button-stub[data-qa="like button"]');
            likeButton.trigger('click');

            await wrapper.vm.$nextTick();
            expect(wrapper.emitted('like')).toEqual([[identifier]]);
          });

          it('tracks the event in Matomo', async() => {
            const wrapper = factory({ $auth, storeState: { liked: [] } });

            const likeButton = wrapper.find('b-button-stub[data-qa="like button"]');
            likeButton.trigger('click');

            await wrapper.vm.$nextTick();

            expect(wrapper.vm.$matomo.trackEvent.called).toBe(true);
          });
          describe('when the like limit is reached', () => {
            it('shows the like limit modal', async() => {
              const wrapper = factory({ $auth,
                storeState: { liked: [] },
                storeDispatch: sinon.stub().rejects({ message: '100 likes' }) });

              const bvModalShow = sinon.spy(wrapper.vm.$bvModal, 'show');
              const likeButton = wrapper.find('b-button-stub[data-qa="like button"]');
              await likeButton.trigger('click');

              expect(bvModalShow.calledWith(wrapper.vm.likeLimitModalId)).toBe(true);
            });
          });
          describe('when there is any other error', () => {
            it('throws an error', async() => {
              const wrapper = factory({ $auth,
                storeState: { liked: [] },
                storeDispatch: sinon.stub().rejects() });

              const likeButton = wrapper.find('b-button-stub[data-qa="like button"]');
              await likeButton.trigger('click');

              await expect(wrapper.vm.$store.dispatch()).rejects.toThrowError();
            });
          });
        });
      });

      describe('and an item is already liked', () => {
        beforeEach(() => {
          storeIsLikedGetter.reset();
          storeIsLikedGetter.returns(true);
        });

        it('button text is updated', async() => {
          const wrapper = factory();
          await wrapper.setProps({ buttonText: true });

          const likeButton = wrapper.find('b-button-stub[data-qa="like button"]');
          expect(likeButton.text()).toBe('statuses.liked');
        });

        describe('when pressed', () => {
          it('dispatches to remove item from likes set', () => {
            const wrapper = factory({ $auth, storeState: { liked: [identifier] } });

            const likeButton = wrapper.find('b-button-stub[data-qa="like button"]');
            likeButton.trigger('click');

            expect(storeDispatchSuccess.calledWith('set/unlike', identifier)).toBe(true);
          });

          it('emits "unlike" event', async() => {
            const wrapper = factory({ $auth, storeState: { liked: [identifier] } });

            const likeButton = wrapper.find('b-button-stub[data-qa="like button"]');
            likeButton.trigger('click');

            await wrapper.vm.$nextTick();
            expect(wrapper.emitted('unlike')).toEqual([[identifier]]);
          });
        });
      });
    });
  });

  describe('pin button', () => {
    describe('when on an entity or entity-set page', () => {
      beforeEach(() => {
        storeEntityId = 'http://data.europeana.eu/topic/123';
      });

      it('is visible', async() => {
        const wrapper = factory();
        await wrapper.setProps({ showPins: true });

        const pinButton = wrapper.find('b-button-stub[data-qa="pin button"]');

        expect(pinButton.isVisible()).toBe(true);
      });

      it('does not contain text', async() => {
        const wrapper = factory();
        await wrapper.setProps({ showPins: true });

        const pinButton = wrapper.find('b-button-stub[data-qa="pin button"]');

        expect(pinButton.text()).toBe('');
      });

      describe('when button with text', () => {
        it('contains text', async() => {
          const wrapper = factory();
          await wrapper.setProps({ showPins: true, buttonText: true });

          const pinButton = wrapper.find('b-button-stub[data-qa="pin button"]');

          expect(pinButton.text()).toBe('actions.pin');
        });
      });

      describe('when item is not pinned', () => {
        beforeEach(() => {
          storeIsPinnedGetter.returns(false);
        });

        describe('when pressed', () => {
          const wrapper = factory();
          it('pins the item', async() => {
            await wrapper.setProps({ showPins: true });

            const pinButton = wrapper.find('b-button-stub[data-qa="pin button"]');
            await pinButton.trigger('click');

            expect(storeDispatchSuccess.calledWith('entity/pin')).toBe(true);
          });
          it('shows the pin toast', async() => {
            await wrapper.setProps({ showPins: true });

            const pinButton = wrapper.find('b-button-stub[data-qa="pin button"]');
            await pinButton.trigger('click');

            expect(makeToastSpy.calledWith('entity.notifications.pinned')).toBe(true);
          });
          describe('when there is no set yet for the curated collection', () => {
            it('creates a set', async() => {
              const wrapper = factory({ storeState: { featuredSetId: null } });

              const pinButton = wrapper.find('b-button-stub[data-qa="pin button"]');
              await pinButton.trigger('click');

              expect(storeDispatchSuccess.calledWith('entity/createFeaturedSet')).toBe(true);
            });
          });
          describe('when the pin limit is reached', () => {
            it('shows the pinned limit modal', async() => {
              const wrapper = factory({ storeDispatch: sinon.stub().rejects({ message: 'too many pins' }) });
              await wrapper.setProps({ showPins: true });
              const bvModalShow = sinon.spy(wrapper.vm.$bvModal, 'show');

              const pinButton = wrapper.find('b-button-stub[data-qa="pin button"]');
              await pinButton.trigger('click');

              expect(bvModalShow.calledWith(`pinned-limit-modal-${identifier}`)).toBe(true);
            });
          });
          describe('when there is any other error', () => {
            it('throws an error', async() => {
              const wrapper = factory({ storeDispatch: sinon.stub().rejects() });
              await wrapper.setProps({ showPins: true });

              const pinButton = wrapper.find('b-button-stub[data-qa="pin button"]');
              await pinButton.trigger('click');

              await expect(wrapper.vm.$store.dispatch()).rejects.toThrowError();
            });
          });
        });
      });
      describe('when item is pinned', () => {
        beforeEach(() => {
          storeIsPinnedGetter.returns(true);
        });

        it('button text is updated', async() => {
          const wrapper = factory();
          await wrapper.setProps({ showPins: true, buttonText: true });

          const pinButton = wrapper.find('b-button-stub[data-qa="pin button"]');
          expect(pinButton.text()).toBe('statuses.pinned');
        });

        describe('when pressed', () => {
          it('unpins the item', async() => {
            const wrapper = factory();
            await wrapper.setProps({ showPins: true });

            const pinButton = wrapper.find('b-button-stub[data-qa="pin button"]');
            await pinButton.trigger('click');

            expect(storeDispatchSuccess.calledWith('entity/unpin')).toBe(true);
          });
          it('shows the pin toast', async() => {
            const wrapper = factory();
            await wrapper.setProps({ showPins: true });

            const pinButton = wrapper.find('b-button-stub[data-qa="pin button"]');
            await pinButton.trigger('click');

            expect(makeToastSpy.calledWith('entity.notifications.unpinned')).toBe(true);
          });
        });
      });
    });

    describe('when on an item page', () => {
      beforeEach(() => {
        storeItemIdGetter.returns('/123/abc');
        storeEntityId = undefined;
      });

      describe('when the item has related entities', () => {
        it('is visible', async() => {
          const wrapper = factory();
          await wrapper.setProps({ showPins: true, entities: ['http://data.europeana.eu/topic/123'] });
          sinon.stub(wrapper.vm, 'entity').returns(false);

          const pinButton = wrapper.find('b-button-stub[data-qa="pin button"]');

          expect(pinButton.isVisible()).toBe(true);
        });

        describe('when clicked', () => {
          it('opens the modal', async() => {
            const wrapper = factory();
            await wrapper.setProps({ showPins: true, entities: ['http://data.europeana.eu/topic/123'] });
            const bvModalShow = sinon.spy(wrapper.vm.$bvModal, 'show');

            const pinButton = wrapper.find('b-button-stub[data-qa="pin button"]');
            await pinButton.trigger('click');

            expect(bvModalShow.calledWith(`pin-modal-${identifier}`)).toBe(true);
          });
        });
      });
    });
  });

  describe('methods', () => {
    describe('clickCreateSet', () => {
      it('shows the form modal', async() => {
        const wrapper = factory();
        await wrapper.vm.clickCreateSet();

        expect(wrapper.vm.showFormModal).toBe(true);
      });
    });
    describe('setCreatedOrUpdated', () => {
      it('shows the create/update modal', async() => {
        const wrapper = factory();
        await wrapper.vm.setCreatedOrUpdated();

        expect(wrapper.vm.newSetCreated).toBe(true);
      });
    });
    describe('refreshSet', () => {
      it('refreshes the set', async() => {
        const wrapper = factory();
        await wrapper.vm.refreshSet();

        expect(storeDispatchSuccess.calledWith('set/refreshSet')).toBe(true);
      });
    });
    describe('goToPins', () => {
      it('links to pins page', async() => {
        const wrapper = factory();
        await wrapper.vm.goToPins();

        expect($goto.calledWith('mocked path')).toBe(true);
      });
    });
  });
});
