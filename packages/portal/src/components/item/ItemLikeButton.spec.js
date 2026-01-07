import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import sinon from 'sinon';
import ItemLikeButton from '@/components/item/ItemLikeButton';
import * as useMakeToast from '@/composables/makeToast.js';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const identifier = '/123/abc';
const identifiers = identifier;
const likeSpy = sinon.spy();
const unlikeSpy = sinon.spy();

const factory = ({ propsData = { identifiers }, provide = {},  $auth = {} } = {}) => shallowMount(ItemLikeButton, {
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
    $matomo: {
      trackEvent: sinon.spy()
    },
    $t: (key) => key,
    $tc: (key) => key
  },
  provide: {
    like: likeSpy,
    likedItems: {},
    unlike: unlikeSpy,
    ...provide
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
          it('calls injected like handler', async() => {
            const wrapper = factory({ $auth });

            const likeButton = wrapper.find('b-button-stub[data-qa="like button"]');
            await likeButton.trigger('click');

            expect(likeSpy.calledWith()).toBe(true);
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

            expect(wrapper.vm.makeToast.calledWith('set.notifications.itemsLiked.1')).toBe(true);
          });
        });
      });

      describe('and an item is already liked', () => {
        const propsData = { buttonText: true, identifiers };
        const provide = { likedItems: { [identifier]: true } };

        it('updates button text', () => {
          const wrapper = factory({ propsData, provide });

          const likeButton = wrapper.find('b-button-stub[data-qa="like button"]');

          expect(likeButton.text()).toBe('statuses.liked');
        });

        describe('when pressed', () => {
          it('calls injected unlike handler', () => {
            const wrapper = factory({ $auth, propsData, provide });

            const likeButton = wrapper.find('b-button-stub[data-qa="like button"]');
            likeButton.trigger('click');

            expect(unlikeSpy.calledWith()).toBe(true);
          });

          it('makes toast', async() => {
            const wrapper = factory({ $auth, propsData, provide });

            const likeButton = wrapper.find('b-button-stub[data-qa="like button"]');
            await likeButton.trigger('click');

            expect(wrapper.vm.makeToast.calledWith('set.notifications.itemsUnliked.1')).toBe(true);
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
