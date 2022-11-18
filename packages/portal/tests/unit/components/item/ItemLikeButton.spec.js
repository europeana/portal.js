import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import ItemLikeButton from '@/components/item/ItemLikeButton';
import sinon from 'sinon';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const identifier = '/123/abc';
const storeDispatchSuccess = sinon.spy();
const storeIsLikedGetter = sinon.stub();

const factory = ({ storeState = {},  $auth = {}, storeDispatch = storeDispatchSuccess } = {}) => shallowMount(ItemLikeButton, {
  localVue,
  propsData: { identifier },
  mocks: {
    $auth,
    $apis: {
      set: {
        modifyItems: sinon.spy()
      }
    },
    $matomo: {
      trackEvent: sinon.spy()
    },
    $store: {
      state: {
        set: {
          liked: [],
          likedItems: [],
          ...storeState
        }
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
          it('dispatches to create likes set if needed', async() => {
            const wrapper = factory({ $auth, storeState: { liked: [], likesId: null } });

            const likeButton = wrapper.find('b-button-stub[data-qa="like button"]');
            await likeButton.trigger('click');

            expect(storeDispatchSuccess.calledWith('set/createLikes')).toBe(true);
          });

          it('adds item to likes set', async() => {
            const wrapper = factory({ $auth, storeState: { liked: [], likesId: 123 } });

            const likeButton = wrapper.find('b-button-stub[data-qa="like button"]');
            await likeButton.trigger('click');

            expect(wrapper.vm.$apis.set.modifyItems.calledWith('add', 123, identifier)).toBe(true);
          });

          it('tracks the event in Matomo', async() => {
            const wrapper = factory({ $auth, storeState: { liked: [] } });

            const likeButton = wrapper.find('b-button-stub[data-qa="like button"]');
            await likeButton.trigger('click');

            expect(wrapper.vm.$matomo.trackEvent.called).toBe(true);
          });

          describe('when the like limit is reached', () => {
            it('shows the like limit modal', async() => {
              const wrapper = factory({
                $auth,
                storeState: { likedItems: Array.from(Array(100).keys()) }
              });

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
          it('removes item from likes set', async() => {
            const wrapper = factory({ $auth, storeState: { liked: [identifier], likesId: 123 } });

            const likeButton = wrapper.find('b-button-stub[data-qa="like button"]');
            await likeButton.trigger('click');

            expect(wrapper.vm.$apis.set.modifyItems.calledWith('delete', 123, identifier)).toBe(true);
          });
        });
      });
    });
  });
});
