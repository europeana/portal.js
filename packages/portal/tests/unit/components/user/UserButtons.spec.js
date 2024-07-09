import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import UserButtons from '@/components/user/UserButtons';
import sinon from 'sinon';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const identifier = '/123/abc';

const factory = ({ propsData = {} } = {}) => shallowMount(UserButtons, {
  localVue,
  attachTo: document.body,
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
    'ItemPinButton',
    'ItemRemoveButton'
  ]
});

describe('components/user/UserButtons', () => {
  describe('pin button', () => {
    it('does not exist by default', () => {
      const wrapper = factory();

      const button = wrapper.find('[data-qa="item pin button"]');

      expect(button.exists()).toBe(false);
    });

    it('exists if enabled by `showPins` prop', () => {
      const wrapper = factory({ propsData: { showPins: true } });

      const button = wrapper.find('[data-qa="item pin button"]');

      expect(button.exists()).toBe(true);
    });
  });

  describe('move button', () => {
    it('does not exist by default', () => {
      const wrapper = factory();

      const button = wrapper.find('[data-qa="item move button"]');

      expect(button.exists()).toBe(false);
    });

    it('exists if enabled by `showMove` prop', () => {
      const wrapper = factory({ propsData: { showMove: true } });

      const button = wrapper.find('[data-qa="item move button"]');

      expect(button.exists()).toBe(true);
    });

    describe('when mouse leaves the button', () => {
      it('hides all tooltips', () => {
        const wrapper = factory({ propsData: { showMove: true } });
        const rootEmit = sinon.spy(wrapper.vm.$root, '$emit');

        const button = wrapper.find('[data-qa="item move button"]');

        button.trigger('mouseleave');

        expect(rootEmit.calledWith('bv::hide::tooltip')).toBe(true);
      });
    });
  });

  describe('add button', () => {
    it('exists', () => {
      const wrapper = factory();

      const button = wrapper.find('[data-qa="item add button"]');

      expect(button.exists()).toBe(true);
    });
  });

  describe('like button', () => {
    it('exists', () => {
      const wrapper = factory();

      const button = wrapper.find('[data-qa="item like button"]');

      expect(button.exists()).toBe(true);
    });
  });

  describe('remove button', () => {
    it('does not exist by default', () => {
      const wrapper = factory();

      const button = wrapper.find('[data-qa="item remove button"]');

      expect(button.exists()).toBe(false);
    });

    it('exists if enabled by `showRemove` prop', () => {
      const wrapper = factory({ propsData: { showRemove: true } });

      const button = wrapper.find('[data-qa="item remove button"]');

      expect(button.exists()).toBe(true);
    });
  });
});
