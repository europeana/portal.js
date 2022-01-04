import { createLocalVue, mount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import VueI18n from 'vue-i18n';
import DeleteSetModal from '@/components/set/DeleteSetModal';
import sinon from 'sinon';

const localVue = createLocalVue();
localVue.use(BootstrapVue);
localVue.use(VueI18n);

const storeDispatch = sinon.stub().resolves({});

import messages from '@/lang/en';

const i18n = new VueI18n({
  locale: 'en',
  messages: {
    en: messages
  }
});

const factory = (propsData = {}) => mount(DeleteSetModal, {
  localVue,
  propsData: {
    modalStatic: true,
    ...propsData
  },
  i18n,
  mocks: {
    $store: {
      dispatch: storeDispatch
    }
  }
});

describe('components/set/DeleteSetModal', () => {
  it('shows a warning message', () => {
    const wrapper = factory({ setId: '123' });

    const modalText = wrapper.text();

    expect(modalText).toContain('Are you sure you want to delete this gallery?');
  });

  describe('cancel button', () => {
    it('hides the modal', () => {
      const wrapper = factory({ setId: '123' });
      const bvModalHide = sinon.spy(wrapper.vm.$bvModal, 'hide');

      wrapper.find('[data-qa="close button"]').trigger('click');

      expect(bvModalHide.calledWith('delete-set-modal'));
    });

    it('emits "cancel" event', () => {
      const wrapper = factory({ setId: '123' });

      wrapper.find('[data-qa="close button"]').trigger('click');

      expect(wrapper.emitted('cancel').length).toEqual(1);
    });

    it('does not delete the set!', () => {
      const wrapper = factory({ setId: '123' });

      wrapper.find('[data-qa="close button"]').trigger('click');

      expect(storeDispatch.called).toBe(false);
    });
  });

  describe('form submission', () => {
    it('deletes the set', async() => {
      const wrapper = factory({ setId: '123' });

      await wrapper.find('form').trigger('submit.stop.prevent');

      expect(storeDispatch.calledWith('set/deleteSet', '123'));
    });

    it('hides the modal', async() => {
      const wrapper = factory({ setId: '123' });
      const bvModalHide = sinon.spy(wrapper.vm.$bvModal, 'hide');

      await wrapper.find('form').trigger('submit.stop.prevent');

      expect(bvModalHide.calledWith('delete-set-modal'));
    });

    it('makes toast', async() => {
      const wrapper = factory({ setId: '123' });
      const rootBvToast = sinon.spy(wrapper.vm.$root.$bvToast, 'toast');

      await wrapper.find('form').trigger('submit.stop.prevent');

      expect(rootBvToast.calledWith('Your gallery has been deleted.', sinon.match.any));
    });
  });
});
