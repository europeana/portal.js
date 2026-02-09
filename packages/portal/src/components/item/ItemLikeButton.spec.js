import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import sinon from 'sinon';
import ItemLikeButton from '@/components/item/ItemLikeButton';
import * as useMakeToast from '@/composables/makeToast.js';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const identifiers = ['/123/abc'];

const factory = ({ propsData = { identifiers }, $auth = {} } = {}) => shallowMount(ItemLikeButton, {
  localVue,
  attachTo: document.body,
  propsData,
  mocks: {
    $auth,
    $error: (error) => {
      console.error(error);
      throw error;
    },
    $features: {},
    $keycloak: {
      login: sinon.spy()
    },
    $likedItems: {
      liked: { value: [] },
      like: sinon.spy(),
      unlike: sinon.spy(),
      watchItems: sinon.spy(),
      unwatchItems: sinon.spy()
    },
    $matomo: {
      trackEvent: sinon.spy()
    },
    $t: (key) => key,
    $tc: (key) => key
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
          const wrapper = factory({ $auth });

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
          it('calls plugin like handler', async() => {
            const wrapper = factory({ $auth });

            const likeButton = wrapper.find('b-button-stub[data-qa="like button"]');
            await likeButton.trigger('click');

            expect(wrapper.vm.$likedItems.like.calledWith(identifiers)).toBe(true);
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

            expect(wrapper.vm.makeToast.calledWith('set.notifications.itemsLiked.many')).toBe(true);
          });
        });
      });

      describe('and an item is already liked', () => {
        const propsData = { buttonText: true, identifiers };

        it('updates button text', async() => {
          const wrapper = factory({ $auth, propsData });
          wrapper.vm.$likedItems.liked.value = identifiers;
          await wrapper.vm.$nextTick();

          const likeButton = wrapper.find('b-button-stub[data-qa="like button"]');

          expect(likeButton.text()).toBe('statuses.liked');
        });

        describe('when pressed', () => {
          it('calls plugin unlike handler', async() => {
            const wrapper = factory({ $auth, propsData });
            wrapper.vm.$likedItems.liked.value = identifiers;
            await wrapper.vm.$nextTick();

            const likeButton = wrapper.find('b-button-stub[data-qa="like button"]');
            likeButton.trigger('click');

            expect(wrapper.vm.$likedItems.unlike.calledWith(identifiers)).toBe(true);
          });

          it('makes toast', async() => {
            const wrapper = factory({ $auth, propsData });
            wrapper.vm.$likedItems.liked.value = identifiers;
            await wrapper.vm.$nextTick();

            const likeButton = wrapper.find('b-button-stub[data-qa="like button"]');
            await likeButton.trigger('click');

            expect(wrapper.vm.makeToast.calledWith('set.notifications.itemsUnliked.many')).toBe(true);
          });
        });
      });
    });

    it('is disabled if there are no item identifiers', () => {
      const wrapper = factory({ propsData: { identifiers: [] } });

      const likeButton = wrapper.find('[data-qa="like button"]');

      expect(likeButton.attributes('disabled')).toBe('true');
    });
  });
});
