import { createLocalVue, mount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import UserButtons from '../../../../components/account/UserButtons.vue';
import sinon from 'sinon';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const mockProps =  {
  itemUrl: {
    params: ['item-id-01']
  }
};

const factory = () => mount(UserButtons, {
  localVue,
  methods: { setLiked: sinon.spy() },
  mocks: {
    $store: {
      state: {
        set: {
        }
      },
      dispatch: sinon.spy()
    },
    $t: () => {}
  }
});

describe('components/account/UserButtons', () => {
  it('it displays a like button', () => {
    const wrapper = factory();
    const likeButton = wrapper.find('[data-qa="like button"]');
    likeButton.isVisible().should.equal(true);
  });
  it('likes an item when the like button is clicked', async() => {
    const wrapper = factory();
    const likeButton = wrapper.find('[data-qa="like button"]');
    wrapper.setData({
      liked: false
    });
    wrapper.setProps(mockProps);
    await likeButton.trigger('click');
    await wrapper.vm.$nextTick();
    likeButton.attributes('aria-pressed').should.eq('true');
  });
  it('unlikes a liked item when the like button is clicked', async() => {
    const wrapper = factory();
    wrapper.setData({
      liked: true
    });
    wrapper.setProps(mockProps);
    const likeButton = wrapper.find('[data-qa="like button"]');
    await likeButton.trigger('click');
    await wrapper.vm.$nextTick();
    likeButton.attributes('aria-pressed').should.eq('false');
  });
});
