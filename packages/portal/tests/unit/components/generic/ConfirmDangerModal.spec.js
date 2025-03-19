import { createLocalVue, mount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import ConfirmDangerModal from '@/components/generic/ConfirmDangerModal';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = ({ propsData } = {}) => mount(ConfirmDangerModal, {
  localVue,
  propsData: {
    modalStatic: true,
    ...propsData
  },
  mocks: {
    $t: (key) => key
  }
});

describe('components/generic/ConfirmDangerModal', () => {
  it('shows the prompt text', () => {
    const promptText = 'Are you sure!?';
    const wrapper = factory({ propsData: { promptText } });

    const modalText = wrapper.text();

    expect(modalText).toContain(promptText);
  });

  describe('cancel button', () => {
    it('emits input event with value false', async() => {
      const wrapper = factory({ propsData: { value: true } });

      await wrapper.find('[data-qa="cancel button"]').trigger('click');

      expect(wrapper.emitted('input')[0]).toEqual([false]);
    });

    it('emits cancel event', async() => {
      const wrapper = factory({ propsData: { value: true } });

      await wrapper.find('[data-qa="cancel button"]').trigger('click');

      expect(wrapper.emitted('cancel').length).toBe(1);
    });
  });

  describe('form submission', () => {
    it('hides the modal', async() => {
      const wrapper = factory({ propsData: { value: true } });

      await wrapper.find('form').trigger('submit.stop.prevent');

      expect(wrapper.emitted('input')[0]).toEqual([false]);
    });

    it('emits confirm event', async() => {
      const wrapper = factory();

      await wrapper.find('form').trigger('submit.stop.prevent');

      expect(wrapper.emitted('confirm').length).toBe(1);
    });
  });
});
