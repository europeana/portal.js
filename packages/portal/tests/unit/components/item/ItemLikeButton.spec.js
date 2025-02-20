import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import ItemLikeButton from '@/components/item/ItemLikeButton';
import sinon from 'sinon';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const identifier = '/123/abc';
const setId = 'setId';
const storeDispatchSuccess = sinon.spy();
const storeIsLikedGetter = sinon.stub();
const storeCommitSpy = sinon.spy();
const setApiCreateLikesStub = sinon.stub().resolves({ id: setId });

const factory = ({ storeState = {},  $auth = {}, storeDispatch = storeDispatchSuccess } = {}) => shallowMount(ItemLikeButton, {
  localVue,
  attachTo: document.body,
  propsData: { identifier },
  mocks: {
    $apis: {
      set: {
        createLikes: setApiCreateLikesStub
      }
    },
    $auth,
    $features: {},
    $matomo: {
      trackEvent: sinon.spy()
    },
    $store: {
      commit: storeCommitSpy,
      state: {
        set: { ...{ liked: [] }, ...storeState }
      },
      getters: {
        'set/isLiked': storeIsLikedGetter
      },
      dispatch: storeDispatch
    },
    $t: (key) => key
  }
});

describe('components/item/ItemLikeButton', () => {
  afterEach(sinon.resetHistory);
  afterAll(sinon.reset);

  describe('template', () => {
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
          it('creates likes set via $apis.set, then commits ID to store', async() => {
            const wrapper = factory({ $auth, storeState: { liked: [], likesId: null } });

            const likeButton = wrapper.find('b-button-stub[data-qa="like button"]');
            await likeButton.trigger('click');

            expect(setApiCreateLikesStub.calledWith()).toBe(true);
            expect(storeCommitSpy.calledWith('set/setLikesId', setId)).toBe(true);
          });

          it('dispatches to add item to likes set', () => {
            const wrapper = factory({ $auth, storeState: { liked: [] } });

            const likeButton = wrapper.find('b-button-stub[data-qa="like button"]');
            likeButton.trigger('click');

            expect(storeDispatchSuccess.calledWith('set/like', identifier)).toBe(true);
          });

          it('tracks the event in Matomo', async() => {
            const wrapper = factory({ $auth, storeState: { liked: [] } });

            const likeButton = wrapper.find('b-button-stub[data-qa="like button"]');
            likeButton.trigger('click');

            await wrapper.vm.$nextTick();

            expect(wrapper.vm.$matomo.trackEvent.called).toBe(true);
          });
          it('makes toast', async() => {
            const wrapper = factory({ $auth, storeState: { liked: [] } });
            const makeToast = sinon.spy(wrapper.vm, 'makeToast');

            const likeButton = wrapper.find('b-button-stub[data-qa="like button"]');
            await likeButton.trigger('click');

            expect(makeToast.calledWith('set.notifications.itemLiked')).toBe(true);
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
          it('makes toast', async() => {
            const wrapper = factory({ $auth, storeState: { liked: [] } });
            const makeToast = sinon.spy(wrapper.vm, 'makeToast');

            const likeButton = wrapper.find('b-button-stub[data-qa="like button"]');
            await likeButton.trigger('click');

            expect(makeToast.calledWith('set.notifications.itemUnliked')).toBe(true);
          });
        });
      });
    });
  });
});
