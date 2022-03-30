import { createLocalVue, mount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import UserButtons from '@/components/account/UserButtons';
import sinon from 'sinon';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const identifier = '/123/abc';
const storeDispatch = sinon.spy();
const storeIsLikedGetter = sinon.stub();
const storeIsPinnedGetter = sinon.stub();
const makeToastSpy = sinon.spy();

const mixins = [
  {
    methods: {
      makeToast: makeToastSpy
    }
  }
];

const factory = ({ storeState = {}, $auth = {} } = {}) => mount(UserButtons, {
  localVue,
  stubs: ['AddItemToSetModal', 'SetFormModal'],
  propsData: { identifier },
  mixins,
  mocks: {
    $auth,
    $store: {
      state: {
        set: { ...{ liked: [] }, ...storeState },
        entity: { ...{ pinned: [] }, ...storeState }
      },
      getters: {
        'set/isLiked': storeIsLikedGetter,
        'entity/isPinned': storeIsPinnedGetter
      },
      dispatch: storeDispatch
    },
    $t: (key) => key
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

      const addButton = wrapper.find('[data-qa="add button"]');

      expect(addButton.isVisible()).toBe(true);
    });

    describe('when user is not logged in', () => {
      const $auth = { loggedIn: false };

      describe('when pressed', () => {
        it('goes to login', () => {
          const wrapper = factory({ $auth });
          wrapper.vm.keycloakLogin = sinon.spy();

          const addButton = wrapper.find('[data-qa="add button"]');
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

          const addButton = wrapper.find('[data-qa="add button"]');
          addButton.trigger('click');

          expect(bvModalShow.calledWith(`add-item-to-set-modal-${identifier}`)).toBe(true);
        });

        it('emits "add" event', async() => {
          const wrapper = factory({ $auth });

          const addButton = wrapper.find('[data-qa="add button"]');
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

      const likeButton = wrapper.find('[data-qa="like button"]');

      expect(likeButton.isVisible()).toBe(true);
    });
    it('does not contain text', () => {
      const wrapper = factory();

      const likeButton = wrapper.find('[data-qa="like button"]');

      expect(likeButton.text()).toBe('');
    });

    describe('when button with text', () => {
      it('contains text', async() => {
        const wrapper = factory();
        await wrapper.setProps({ buttonText: true });

        const likeButton = wrapper.find('[data-qa="like button"]');

        expect(likeButton.text()).toBe('actions.like');
      });
    });

    describe('when user is not logged in', () => {
      const $auth = { loggedIn: false };

      describe('when pressed', () => {
        it('goes to login', () => {
          const wrapper = factory({ $auth, storeState: { liked: [], likesId: null } });
          wrapper.vm.keycloakLogin = sinon.spy();

          const likeButton = wrapper.find('[data-qa="like button"]');
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

        it('is rendered as unpressed', () => {
          const wrapper = factory({ $auth });

          const likeButton = wrapper.find('[data-qa="like button"]');

          expect(likeButton.attributes('aria-pressed')).toBe('false');
        });

        describe('when pressed', () => {
          it('dispatches to create likes set if needed', () => {
            const wrapper = factory({ $auth, storeState: { liked: [], likesId: null } });

            const likeButton = wrapper.find('[data-qa="like button"]');
            likeButton.trigger('click');

            expect(storeDispatch.calledWith('set/createLikes')).toBe(true);
          });

          it('dispatches to add item to likes set', () => {
            const wrapper = factory({ $auth, storeState: { liked: [] } });

            const likeButton = wrapper.find('[data-qa="like button"]');
            likeButton.trigger('click');

            expect(storeDispatch.calledWith('set/like', identifier)).toBe(true);
          });

          it('emits "like" event', async() => {
            const wrapper = factory({ $auth, storeState: { liked: [] } });

            const likeButton = wrapper.find('[data-qa="like button"]');
            likeButton.trigger('click');

            await wrapper.vm.$nextTick();
            expect(wrapper.emitted('like')).toEqual([[identifier]]);
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

          const likeButton = wrapper.find('[data-qa="like button"]');
          expect(likeButton.text()).toBe('statuses.liked');
        });
        it('is rendered as pressed', () => {
          const wrapper = factory({ $auth, storeState: { liked: [identifier] } });

          const likeButton = wrapper.find('[data-qa="like button"]');

          expect(likeButton.attributes('aria-pressed')).toBe('true');
        });

        describe('when pressed', () => {
          it('dispatches to remove item from likes set', () => {
            const wrapper = factory({ $auth, storeState: { liked: [identifier] } });

            const likeButton = wrapper.find('[data-qa="like button"]');
            likeButton.trigger('click');

            expect(storeDispatch.calledWith('set/unlike', identifier)).toBe(true);
          });

          it('emits "unlike" event', async() => {
            const wrapper = factory({ $auth, storeState: { liked: [identifier] } });

            const likeButton = wrapper.find('[data-qa="like button"]');
            likeButton.trigger('click');

            await wrapper.vm.$nextTick();
            expect(wrapper.emitted('unlike')).toEqual([[identifier]]);
          });
        });
      });
    });
  });

  describe('pin button', () => {
    it('is visible', async() => {
      const wrapper = factory();
      await wrapper.setProps({ showPins: true });

      const pinButton = wrapper.find('[data-qa="pin button"]');

      expect(pinButton.isVisible()).toBe(true);
    });

    it('does not contain text', async() => {
      const wrapper = factory();
      await wrapper.setProps({ showPins: true });

      const pinButton = wrapper.find('[data-qa="pin button"]');

      expect(pinButton.text()).toBe('');
    });

    describe('when button with text', () => {
      it('contains text', async() => {
        const wrapper = factory();
        await wrapper.setProps({ showPins: true, buttonText: true });

        const pinButton = wrapper.find('[data-qa="pin button"]');

        expect(pinButton.text()).toBe('actions.pin');
      });
    });

    describe('when item is not pinned', () => {
      beforeEach(() => {
        storeIsPinnedGetter.returns(false);
      });

      it('is rendered as unpressed', async() => {
        const wrapper = factory();
        await wrapper.setProps({ showPins: true });

        const pinButton = wrapper.find('[data-qa="pin button"]');
        expect(pinButton.attributes('aria-pressed')).toBe('false');
      });
      describe('when pressed', () => {
        it('shows the pin toast', async() => {
          const wrapper = factory();
          await wrapper.setProps({ showPins: true });

          const pinButton = wrapper.find('[data-qa="pin button"]');
          await pinButton.trigger('click');

          expect(makeToastSpy.calledWith('entity.notifications.pinned')).toBe(true);
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

        const pinButton = wrapper.find('[data-qa="pin button"]');
        expect(pinButton.text()).toBe('statuses.pinned');
      });
      it('is rendered as pressed', async() => {
        const wrapper = factory();
        await wrapper.setProps({ showPins: true });

        const pinButton = wrapper.find('[data-qa="pin button"]');
        expect(pinButton.attributes('aria-pressed')).toBe('true');
      });
      describe('when pressed', () => {
        it('shows the pin modal', async() => {
          const wrapper = factory();
          await wrapper.setProps({ showPins: true });

          const pinButton = wrapper.find('[data-qa="pin button"]');
          await pinButton.trigger('click');

          expect(makeToastSpy.calledWith('entity.notifications.unpinned')).toBe(true);
        });
      });
    });
  });
});
