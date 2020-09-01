import { createLocalVue, mount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import UserButtons from '../../../../components/account/UserButtons';
import sinon from 'sinon';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const identifier = '/123/abc';
const storeDispatch = sinon.spy();

const factory = ({ storeState = {}, $auth = {} } = {}) => mount(UserButtons, {
  localVue,
  stubs: ['AddItemToSetModal', 'SetFormModal'],
  propsData: { value: identifier },
  methods: { showUserButtons: true },
  mocks: {
    $auth,
    $store: {
      state: {
        set: { ...{ liked: [] }, ...storeState }
      },
      dispatch: storeDispatch
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

  describe('user buttons', () => {
    it('are enabled', () => {
      const wrapper = factory();

      const userButtons = wrapper.find('[data-qa="user buttons"]');

      userButtons.exists().should.be.true;
    });
  });

  describe('add button', () => {
    it('is visible', () => {
      const wrapper = factory();

      const addButton = wrapper.find('[data-qa="add button"]');

      addButton.isVisible().should.be.true;
    });

    context('when user is not logged in', () => {
      const $auth = { loggedIn: false, loginWith: sinon.spy() };

      context('when pressed', () => {
        it('logs in with Keycloak', () => {
          const wrapper = factory({ $auth });

          const addButton = wrapper.find('[data-qa="add button"]');
          addButton.trigger('click');

          $auth.loginWith.should.have.been.calledWith('keycloak');
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

    context('when an item is not yet liked', () => {
      it('is rendered as unpressed', () => {
        const wrapper = factory({ storeState: { liked: [] } });

        const likeButton = wrapper.find('[data-qa="like button"]');

        likeButton.attributes('aria-pressed').should.eq('false');
      });

      context('when pressed', () => {
        it('dispatches to create likes set if needed', () => {
          const wrapper = factory({ storeState: { liked: [], likesId: null } });

          const likeButton = wrapper.find('[data-qa="like button"]');
          likeButton.trigger('click');

          storeDispatch.should.have.been.calledWith('set/createLikes');
        });

        it('dispatches to add item to likes set', () => {
          const wrapper = factory({ storeState: { liked: [] } });

          const likeButton = wrapper.find('[data-qa="like button"]');
          likeButton.trigger('click');

          storeDispatch.should.have.been.calledWith('set/like', identifier);
        });

        it('emits "like" event', async() => {
          const wrapper = factory({ storeState: { liked: [] } });

          const likeButton = wrapper.find('[data-qa="like button"]');
          likeButton.trigger('click');

          await wrapper.vm.$nextTick();
          wrapper.emitted('like').should.eql([[identifier]]);
        });
      });
    });

    context('and an item is already liked', () => {
      it('is rendered as pressed', () => {
        const wrapper = factory({ storeState: { liked: [identifier] } });

        const likeButton = wrapper.find('[data-qa="like button"]');

        likeButton.attributes('aria-pressed').should.eq('true');
      });

      context('when pressed', () => {
        it('dispatches to remove item from likes set', () => {
          const wrapper = factory({ storeState: { liked: [identifier] } });

          const likeButton = wrapper.find('[data-qa="like button"]');
          likeButton.trigger('click');

          storeDispatch.should.have.been.calledWith('set/unlike', identifier);
        });

        it('emits "unlike" event', async() => {
          const wrapper = factory({ storeState: { liked: [identifier] } });

          const likeButton = wrapper.find('[data-qa="like button"]');
          likeButton.trigger('click');

          await wrapper.vm.$nextTick();
          wrapper.emitted('unlike').should.eql([[identifier]]);
        });
      });
    });
  });
});
