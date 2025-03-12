import { createLocalVue, mount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import ConfirmDangerModal from '@/components/generic/ConfirmDangerModal';
import sinon from 'sinon';

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
  afterEach(sinon.resetHistory);

  it('shows the prompt text', () => {
    const promptText = 'Are you sure!?';
    const wrapper = factory({ propsData: { promptText } });

    const modalText = wrapper.text();

    expect(modalText).toContain(promptText);
  });

  describe('cancel button', () => {
    it('hides the modal', () => {
      const modalId = 'too-risky';
      const wrapper = factory({ propsData: { modalId } });
      const bvModalHide = sinon.spy(wrapper.vm.$bvModal, 'hide');

      wrapper.find('[data-qa="cancel button"]').trigger('click');

      expect(bvModalHide.calledWith(modalId)).toBe(true);
    });

    it('emits cancel event', () => {
      const wrapper = factory();

      wrapper.find('[data-qa="cancel button"]').trigger('click');

      expect(wrapper.emitted('cancel').length).toBe(1);
    });

    it('does not call the confirm callback', () => {
      const confirm = sinon.spy();
      const wrapper = factory({ propsData: { confirm } });

      wrapper.find('[data-qa="cancel button"]').trigger('click');

      expect(confirm.called).toBe(false);
    });
  });

  describe('form submission', () => {
    it('calls the confirm callback', async() => {
      const confirm = sinon.spy();
      const wrapper = factory({ propsData: { confirm } });

      await wrapper.find('form').trigger('submit.stop.prevent');

      expect(confirm.calledWith()).toBe(true);
    });

    it('hides the modal', async() => {
      const modalId = 'acceptable-risk';
      const wrapper = factory({ propsData: { modalId } });
      const bvModalHide = sinon.spy(wrapper.vm.$bvModal, 'hide');

      await wrapper.find('form').trigger('submit.stop.prevent');

      expect(bvModalHide.calledWith(modalId)).toBe(true);
    });

    it('emits success event', async() => {
      const wrapper = factory();

      await wrapper.find('form').trigger('submit.stop.prevent');

      expect(wrapper.emitted('success').length).toBe(1);
    });

    it('optionally makes toast', async() => {
      const toastMsg = 'it is done';
      const wrapper = factory({ propsData: { toastMsg } });
      const rootBvToast = sinon.spy(wrapper.vm.$root.$bvToast, 'toast');

      await wrapper.find('form').trigger('submit.stop.prevent');

      expect(rootBvToast.calledWith(toastMsg)).toBe(true);
    });
  });
});
