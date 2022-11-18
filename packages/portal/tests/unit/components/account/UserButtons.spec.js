import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import UserButtons from '@/components/account/UserButtons';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const identifier = '/123/abc';

const factory = ({ propsData = {} } = {}) => shallowMount(UserButtons, {
  localVue,
  propsData: {
    identifier,
    ...propsData
  },
  mocks: {
    $t: (key) => key
  },
  stubs: [
    'ItemAddButton',
    'ItemLikeButton',
    'ItemPinButton'
  ]
});

describe('components/account/UserButtons', () => {
  describe('pin button', () => {
    it('does not exist by default', () => {
      const wrapper = factory();

      const button = wrapper.find('[data-qa="pin button"]');

      expect(button.exists()).toBe(false);
    });

    it('exists if enabled by `showPins` prop', () => {
      const wrapper = factory({ propsData: { showPins: true } });

      const button = wrapper.find('[data-qa="pin button"]');

      expect(button.exists()).toBe(true);
    });
  });

  describe('move button', () => {
    it('does not exist by default', () => {
      const wrapper = factory();

      const button = wrapper.find('[data-qa="move button"]');

      expect(button.exists()).toBe(false);
    });

    it('exists if enabled by `showMove` prop', () => {
      const wrapper = factory({ propsData: { showMove: true } });

      const button = wrapper.find('[data-qa="move button"]');

      expect(button.exists()).toBe(true);
    });
  });

  describe('add button', () => {
    it('exists', () => {
      const wrapper = factory();

      const button = wrapper.find('[data-qa="add button"]');

      expect(button.exists()).toBe(true);
    });
  });

  describe('like button', () => {
    it('exists', () => {
      const wrapper = factory();

      const button = wrapper.find('[data-qa="like button"]');

      expect(button.exists()).toBe(true);
    });
  });
});
