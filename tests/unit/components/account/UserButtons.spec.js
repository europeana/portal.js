import { createLocalVue, mount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import UserButtons from '../../../../src/components/account/UserButtons';
import sinon from 'sinon';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const identifier = '/123/abc';
const setId = '/123/def';
const storeDispatch = sinon.spy();
const storeIsLikedGetter = sinon.stub();

const factory = ({ storeState = {}, $auth = {}, recommendationFlag = false } = {}) => mount(UserButtons, {
  localVue,
  stubs: ['AddItemToSetModal', 'SetFormModal'],
  propsData: { value: identifier, recommendedItem: recommendationFlag },
  mocks: {
    $auth,
    $store: {
      state: {
        set: { ...{ liked: [] }, ...storeState }
      },
      getters: {
        'set/isLiked': storeIsLikedGetter
      },
      dispatch: storeDispatch
    },
    $route: {
      params: { pathMatch: '123/def' }
    },
    $t: () => {}
  }
});

describe('components/account/UserButtons', () => {
  describe('collection modal', () => {
    it('is not present', () => {
      const wrapper = factory();

      const collectionModal = wrapper.find('[data-qa="collection modal"]');

      collectionModal.exists().should.be.false;
    });
  });

  describe('add button', () => {
    it('is visible', () => {
      const wrapper = factory();

      const addButton = wrapper.find('[data-qa="add button"]');

      addButton.isVisible().should.be.true;
    });

    context('when user is not logged in', () => {
      const $auth = { loggedIn: false };

      context('when pressed', () => {
        it('goes to login', () => {
          const wrapper = factory({ $auth });
          wrapper.vm.keycloakLogin = sinon.spy();

          const addButton = wrapper.find('[data-qa="add button"]');
          addButton.trigger('click');

          wrapper.vm.keycloakLogin.should.have.been.called;
        });
      });
    });

    context('when user is logged in', () => {
      const $auth = { loggedIn: true };

      context('when pressed', () => {
        it('shows the collection modal', () => {
          const wrapper = factory({ $auth });
          const bvModalShow = sinon.spy(wrapper.vm.$bvModal, 'show');

          const addButton = wrapper.find('[data-qa="add button"]');
          addButton.trigger('click');

          bvModalShow.should.have.been.calledWith(`add-item-to-set-modal-${identifier}`);
        });

        it('emits "add" event', async() => {
          const wrapper = factory({ $auth });

          const addButton = wrapper.find('[data-qa="add button"]');
          addButton.trigger('click');

          await wrapper.vm.$nextTick();
          wrapper.emitted('add').should.eql([[identifier]]);
        });
      });
    });
  });

  describe('like button', () => {
    it('is visible', () => {
      const wrapper = factory();

      const likeButton = wrapper.find('[data-qa="like button"]');

      likeButton.isVisible().should.be.true;
    });

    context('when user is not logged in', () => {
      const $auth = { loggedIn: false };

      context('when pressed', () => {
        it('goes to login', () => {
          const wrapper = factory({ $auth, storeState: { liked: [], likesId: null } });
          wrapper.vm.keycloakLogin = sinon.spy();

          const likeButton = wrapper.find('[data-qa="like button"]');
          likeButton.trigger('click');

          wrapper.vm.keycloakLogin.should.have.been.called;
        });
      });
    });

    context('when user is logged in', () => {
      const $auth = { loggedIn: true };

      context('when an item is not yet liked', () => {
        beforeEach(() => {
          storeIsLikedGetter.reset();
          storeIsLikedGetter.returns(false);
        });

        it('is rendered as unpressed', () => {
          const wrapper = factory({ $auth });

          const likeButton = wrapper.find('[data-qa="like button"]');

          likeButton.attributes('aria-pressed').should.eq('false');
        });

        context('when pressed', () => {
          it('dispatches to create likes set if needed', () => {
            const wrapper = factory({ $auth, storeState: { liked: [], likesId: null } });

            const likeButton = wrapper.find('[data-qa="like button"]');
            likeButton.trigger('click');

            storeDispatch.should.have.been.calledWith('set/createLikes');
          });

          it('dispatches to add item to likes set', () => {
            const wrapper = factory({ $auth, storeState: { liked: [] } });

            const likeButton = wrapper.find('[data-qa="like button"]');
            likeButton.trigger('click');

            storeDispatch.should.have.been.calledWith('set/like', identifier);
          });

          it('emits "like" event', async() => {
            const wrapper = factory({ $auth, storeState: { liked: [] } });

            const likeButton = wrapper.find('[data-qa="like button"]');
            likeButton.trigger('click');

            await wrapper.vm.$nextTick();
            wrapper.emitted('like').should.eql([[identifier]]);
          });
        });
      });

      context('and an item is already liked', () => {
        beforeEach(() => {
          storeIsLikedGetter.reset();
          storeIsLikedGetter.returns(true);
        });

        it('is rendered as pressed', () => {
          const wrapper = factory({ $auth, storeState: { liked: [identifier] } });

          const likeButton = wrapper.find('[data-qa="like button"]');

          likeButton.attributes('aria-pressed').should.eq('true');
        });

        context('when pressed', () => {
          it('dispatches to remove item from likes set', () => {
            const wrapper = factory({ $auth, storeState: { liked: [identifier] } });

            const likeButton = wrapper.find('[data-qa="like button"]');
            likeButton.trigger('click');

            storeDispatch.should.have.been.calledWith('set/unlike', identifier);
          });

          it('emits "unlike" event', async() => {
            const wrapper = factory({ $auth, storeState: { liked: [identifier] } });

            const likeButton = wrapper.find('[data-qa="like button"]');
            likeButton.trigger('click');

            await wrapper.vm.$nextTick();
            wrapper.emitted('unlike').should.eql([[identifier]]);
          });
        });
      });
    });
  });

  describe('accept button', () => {
    it('is visible', () => {
      const wrapper = factory({ recommendationFlag: true });

      const acceptButton = wrapper.find('[data-qa="accept button"]');

      acceptButton.isVisible().should.be.true;
    });

    context('when user is logged in', () => {
      const $auth = { loggedIn: true };

      context('when pressed', () => {
        it('dispatches to accept recommended item', async() => {
          const wrapper = factory({ $auth, recommendationFlag: true });

          const acceptButton = wrapper.find('[data-qa="accept button"]');
          acceptButton.trigger('click');

          storeDispatch.should.have.been.calledWith('set/acceptRecommendation', { setId, itemIds: ['/123/abc'] });
          storeDispatch.should.have.been.calledWith('set/addItem', { setId: `http://data.europeana.eu/set${setId}`, itemId: identifier });
        });
      });
    });
  });

  describe('reject button', () => {
    it('is visible', () => {
      const wrapper = factory({ recommendationFlag: true });

      const rejectButton = wrapper.find('[data-qa="reject button"]');

      rejectButton.isVisible().should.be.true;
    });

    context('when user is logged in', () => {
      const $auth = { loggedIn: true };

      context('when pressed', () => {
        it('dispatches to reject recommended item', async() => {
          const wrapper = factory({ $auth, recommendationFlag: true });

          const rejectButton = wrapper.find('[data-qa="reject button"]');
          rejectButton.trigger('click');

          storeDispatch.should.have.been.calledWith('set/rejectRecommendation', { setId, itemIds: ['/123/abc'] });
        });
      });
    });
  });
});
