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
let storeFeaturedSetId = 'http://data.europeana.eu/set/567';

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
        'entity/featuredSetId': storeFeaturedSetId,
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
  });
});
