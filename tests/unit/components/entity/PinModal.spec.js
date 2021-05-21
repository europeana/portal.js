import { createLocalVue, mount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import VueI18n from 'vue-i18n';
import PinModal from '../../../../src/components/entity/PinModal';
import sinon from 'sinon';

const util = require('util');
const myLogger = util.debuglog('myloggername');

const localVue = createLocalVue();
localVue.use(BootstrapVue);
localVue.use(VueI18n);

const storeDispatch = sinon.stub().resolves({});
const storeIsPinnedGetter = sinon.stub();

import messages from '../../../../src/lang/en';

const i18n = new VueI18n({
  locale: 'en',
  messages: {
    en: messages
  }
});

const id = '/123/abc';

const factory = (propsData = {}) => mount(PinModal, {
  localVue,
  propsData: {
    modalStatic: true,
    pinned: false,
    ...propsData
  },
  i18n,
  mocks: {
    $store: {
      state: {
        entity: { featuredSetId: '123', pinned: [] }
      },
      getters: {
        'entity/isPinned': storeIsPinnedGetter
      },
      dispatch: storeDispatch
    }
  }
});

describe('components/set/PinModal', () => {
  it('shows an info message', () => {
    const wrapper = factory({ itemId: id, pinned: false });
    wrapper.vm.init();

    const modalText = wrapper.text();
    myLogger(modalText);
    modalText.should.include('Are you sure you want to pin this item?');
  });

  describe('cancel button', () => {
    it('hides the modal', () => {
      const wrapper = factory({ itemId: id, modalId: 'pin-modal-/123/abc' });
      const bvModalHide = sinon.spy(wrapper.vm.$bvModal, 'hide');

      wrapper.find('[data-qa="cancel button"]').trigger('click');

      bvModalHide.should.have.been.calledWith(`pin-modal-${id}`);
    });

    it('does not update set', () => {
      const wrapper = factory({ itemId: id });

      wrapper.find('[data-qa="cancel button"]').trigger('click');

      storeDispatch.should.not.have.been.called;
    });
  });

  describe('toggle pin button', () => {
    it('pins item when not yet pinned', () => {
      const wrapper = factory({ itemId: id, modalId: 'pin-modal-/123/abc' });
      wrapper.find('[data-qa="toggle pin button"]').trigger('click');

      storeDispatch.should.have.been.calledWith('entity/pin', id);
    });
    it('unpins item when already pinned', () => {
      const wrapper = factory({ itemId: id, modalId: 'pin-modal-/123/abc', pinned: true });

      wrapper.find('[data-qa="toggle pin button"]').trigger('click');

      storeDispatch.should.have.been.calledWith('entity/unpin', id);
    });
    it('hides the modal', async() => {
      const wrapper = factory({ itemId: id, modalId: 'pin-modal-/123/abc' });
      const bvModalHide = sinon.spy(wrapper.vm.$bvModal, 'hide');

      await wrapper.find('[data-qa="toggle pin button"]').trigger('click');

      bvModalHide.should.have.been.calledWith(`pin-modal-${id}`);
    });

    it('makes toast', async() => {
      const wrapper = factory({ itemId: id, modalId: 'pin-modal-/123/abc', pinned: false });
      const rootBvToast = sinon.spy(wrapper.vm.$root.$bvToast, 'toast');

      await wrapper.find('[data-qa="toggle pin button"]').trigger('click');

      rootBvToast.should.have.been.calledWith('The item has been pinned. It might take up to 24 hours to appear for everyone.');
    });
  });
});
