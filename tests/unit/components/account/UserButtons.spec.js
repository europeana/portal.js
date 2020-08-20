import { createLocalVue, mount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import UserButtons from '../../../../components/account/UserButtons.vue';
import sinon from 'sinon';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const identifier = '/123/abc';
const storeDispatch = sinon.spy();

const factory = (storeState = {}) => mount(UserButtons, {
  localVue,
  propsData: { value: identifier },
  mocks: {
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
  describe('like button', () => {
    it('is visible', () => {
      const wrapper = factory();

      const likeButton = wrapper.find('[data-qa="like button"]');

      likeButton.isVisible().should.be.true;
    });

    context('when an item is not yet liked', () => {
      it('is rendered as unpressed', () => {
        const wrapper = factory({ liked: [] });

        const likeButton = wrapper.find('[data-qa="like button"]');

        likeButton.attributes('aria-pressed').should.eq('false');
      });

      context('when pressed', () => {
        it('dispatches to create likes set if needed', async() => {
          const wrapper = factory({ liked: [], likesId: null });

          const likeButton = wrapper.find('[data-qa="like button"]');
          likeButton.trigger('click');

          storeDispatch.should.have.been.calledWith('set/createLikes');
        });

        it('dispatches to add item to likes set', async() => {
          const wrapper = factory({ liked: [] });

          const likeButton = wrapper.find('[data-qa="like button"]');
          likeButton.trigger('click');

          storeDispatch.should.have.been.calledWith('set/like', identifier);
        });

        it('emits "like" event', async() => {
          const wrapper = factory({ liked: [] });

          const likeButton = wrapper.find('[data-qa="like button"]');
          likeButton.trigger('click');

          await wrapper.vm.$nextTick();
          wrapper.emitted('like').should.eql([[identifier]]);
        });
      });
    });

    context('when an item is already liked', () => {
      it('is rendered as pressed', () => {
        const wrapper = factory({ liked: [identifier] });

        const likeButton = wrapper.find('[data-qa="like button"]');

        likeButton.attributes('aria-pressed').should.eq('true');
      });

      context('when pressed', () => {
        it('dispatches to remove item from likes set', async() => {
          const wrapper = factory({ liked: [identifier] });

          const likeButton = wrapper.find('[data-qa="like button"]');
          likeButton.trigger('click');

          storeDispatch.should.have.been.calledWith('set/unlike', identifier);
        });

        it('emits "unlike" event', async() => {
          const wrapper = factory({ liked: [identifier] });

          const likeButton = wrapper.find('[data-qa="like button"]');
          likeButton.trigger('click');

          await wrapper.vm.$nextTick();
          wrapper.emitted('unlike').should.eql([[identifier]]);
        });
      });
    });
  });
});
