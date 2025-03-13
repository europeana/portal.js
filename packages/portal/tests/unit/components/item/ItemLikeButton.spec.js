import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import sinon from 'sinon';
import ItemLikeButton from '@/components/item/ItemLikeButton';
import * as useMakeToast from '@/composables/makeToast.js';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const identifier = '/123/abc';
const setId = 'setId';
const storeDispatchSuccess = sinon.spy();
const storeCommitSpy = sinon.spy();
const setApiCreateLikesStub = sinon.stub().resolves({ id: setId });

const factory = ({ propsData = { identifiers: identifier }, storeState = {},  $auth = {}, storeDispatch = storeDispatchSuccess } = {}) => shallowMount(ItemLikeButton, {
  localVue,
  attachTo: document.body,
  propsData,
  mocks: {
    $apis: {
      set: {
        createLikes: setApiCreateLikesStub
      }
    },
    $auth,
    $features: {},
    $keycloak: {
      login: sinon.spy()
    },
    $matomo: {
      trackEvent: sinon.spy()
    },
    $store: {
      commit: storeCommitSpy,
      state: {
        set: { likedItemIds: [], ...storeState }
      },
      dispatch: storeDispatch
    },
    $t: (key) => key
  }
});

describe('components/item/ItemLikeButton', () => {
  beforeAll(() => {
    sinon.stub(useMakeToast, 'default').returns({
      makeToast: sinon.spy()
    });
  });
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
          const wrapper = factory({ $auth, storeState: { likesId: null } });

          const likeButton = wrapper.find('b-button-stub[data-qa="like button"]');
          likeButton.trigger('click');

          expect(wrapper.vm.$keycloak.login.called).toBe(true);
        });
      });
    });

    describe('when user is logged in', () => {
      const $auth = { loggedIn: true };

      describe('when an item is not yet liked', () => {
        describe('when pressed', () => {
          it('creates likes set via $apis.set, then commits ID to store', async() => {
            const wrapper = factory({ $auth, storeState: { likesId: null } });

            const likeButton = wrapper.find('b-button-stub[data-qa="like button"]');
            await likeButton.trigger('click');

            expect(setApiCreateLikesStub.calledWith()).toBe(true);
            expect(storeCommitSpy.calledWith('set/setLikesId', setId)).toBe(true);
          });

          it('dispatches to add item to likes set', () => {
            const wrapper = factory({ $auth });

            const likeButton = wrapper.find('b-button-stub[data-qa="like button"]');
            likeButton.trigger('click');

            expect(storeDispatchSuccess.calledWith('set/like', identifier)).toBe(true);
          });

          it('tracks the event in Matomo', async() => {
            const wrapper = factory({ $auth });

            const likeButton = wrapper.find('b-button-stub[data-qa="like button"]');
            likeButton.trigger('click');

            await wrapper.vm.$nextTick();

            expect(wrapper.vm.$matomo.trackEvent.called).toBe(true);
          });
          it('makes toast', async() => {
            const wrapper = factory({ $auth });

            const likeButton = wrapper.find('b-button-stub[data-qa="like button"]');
            await likeButton.trigger('click');

            expect(wrapper.vm.makeToast.calledWith('set.notifications.itemLiked')).toBe(true);
          });
          describe('when the like limit is reached', () => {
            it('shows the like limit modal', async() => {
              const wrapper = factory({ $auth,
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
        const storeState = { likedItemIds: [identifier] };

        it('button text is updated', async() => {
          const wrapper = factory({ storeState });
          await wrapper.setProps({ buttonText: true });

          const likeButton = wrapper.find('b-button-stub[data-qa="like button"]');
          expect(likeButton.text()).toBe('statuses.liked');
        });

        describe('when pressed', () => {
          it('dispatches to remove item from likes set', () => {
            const wrapper = factory({ $auth, storeState });

            const likeButton = wrapper.find('b-button-stub[data-qa="like button"]');
            likeButton.trigger('click');

            expect(storeDispatchSuccess.calledWith('set/unlike', identifier)).toBe(true);
          });
          it('makes toast', async() => {
            const wrapper = factory({ $auth, storeState });

            const likeButton = wrapper.find('b-button-stub[data-qa="like button"]');
            await likeButton.trigger('click');

            expect(wrapper.vm.makeToast.calledWith('set.notifications.itemUnliked')).toBe(true);
          });
        });
      });

      describe('data()', () => {
        describe('likeLimitModalId', () => {
          describe('when there are multiple items selected', () => {
            it('ends with "multi-select"', () => {
              const wrapper = factory({
                propsData: { identifiers: ['001', '002', '003'] }
              });

              expect(wrapper.vm.likeLimitModalId).toEqual('like-limit-modal-multi-select');
            });
          });
        });
      });

      describe('computed', () => {
        describe('liked()', () => {
          describe('when there are multiple items selected', () => {
            describe('and all are already liked', () => {
              it('returns true', () => {
                const ids = ['001', '002'];
                const wrapper = factory({
                  propsData: { identifiers: ids },
                  storeState: { likedItemIds: ids },
                  $auth
                });

                expect(wrapper.vm.liked).toBe(true);
              });
            });
            describe('and only some are already liked', () => {
              it('returns false', () => {
                const wrapper = factory({
                  propsData: { identifiers: ['001', '002', '003'] },
                  storeState: { likedItemIds: ['001', '003'] },
                  $auth
                });

                expect(wrapper.vm.liked).toBe(false);
              });
            });
          });
        });
      });
    });
  });
});
