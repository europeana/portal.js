import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import sinon from 'sinon';
import ItemLikeButton from '@/components/item/ItemLikeButton';
import * as useLikedItems from '@/composables/likedItems.js';
import * as useMakeToast from '@/composables/makeToast.js';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const identifier = '/123/abc';
const setId = '123';
const storeCommitSpy = sinon.spy();
const setApiCreateLikesStub = sinon.stub().resolves({ id: setId });
const setApiDeleteItemsStub = sinon.spy();
const setApiInsertItemsStub = sinon.spy();

const factory = ({ propsData = {}, storeState = { likesId: setId }, $auth = {} } = {}) => shallowMount(ItemLikeButton, {
  localVue,
  attachTo: document.body,
  propsData: { identifier, ...propsData },
  mocks: {
    $apis: {
      set: {
        createLikes: setApiCreateLikesStub,
        deleteItems: setApiDeleteItemsStub,
        insertItems: setApiInsertItemsStub
      }
    },
    $auth,
    $error: (error) => {
      console.error(error);
      throw error;
    },
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
        set: storeState
      }
    },
    $t: (key) => key
  }
});

describe('components/item/ItemLikeButton', () => {
  beforeAll(() => {
    sinon.stub(useMakeToast, 'default').returns({
      makeToast: sinon.spy()
    });
    sinon.stub(useLikedItems, 'default').returns({
      like: sinon.spy(),
      unlike: sinon.spy()
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

          it('adds item to likes set via useLikedItems composable', () => {
            const wrapper = factory({ $auth });

            const likeButton = wrapper.find('b-button-stub[data-qa="like button"]');
            likeButton.trigger('click');

            expect(wrapper.vm.likeItem.calledWith(identifier)).toBe(true);
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
        });
      });

      describe('and an item is already liked', () => {
        const propsData = { buttonText: true, value: true };

        it('button text is updated', () => {
          const wrapper = factory({ propsData });

          const likeButton = wrapper.find('b-button-stub[data-qa="like button"]');

          expect(likeButton.text()).toBe('statuses.liked');
        });

        describe('when pressed', () => {
          it('removes item from likes set via useLikedItems composable', () => {
            const wrapper = factory({ $auth, propsData });

            const likeButton = wrapper.find('b-button-stub[data-qa="like button"]');
            likeButton.trigger('click');

            expect(wrapper.vm.unlikeItem.calledWith(identifier)).toBe(true);
          });

          it('makes toast', async() => {
            const wrapper = factory({ $auth, propsData });

            const likeButton = wrapper.find('b-button-stub[data-qa="like button"]');
            await likeButton.trigger('click');

            expect(wrapper.vm.makeToast.calledWith('set.notifications.itemUnliked')).toBe(true);
          });
        });
      });
    });
  });

  describe('methods', () => {

  });
});
