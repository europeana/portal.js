import { createLocalVue, mount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import AddItemToSetModal from '@/components/set/AddItemToSetModal';
import sinon from 'sinon';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const storeDispatch = sinon.stub().resolves({});

const sets = [
  {
    id: '001',
    items: ['http://data.europeana.eu/item/000/aaa'],
    title: 'Test collection',
    total: 1,
    visibility: 'public'
  }
];

const factory = (propsData = {}) => mount(AddItemToSetModal, {
  localVue,
  propsData: {
    modalStatic: true,
    ...propsData
  },
  mocks: {
    $t: () => {},
    $tc: () => {},
    $i18n: {},
    $apis: {
      set: {
        getSetThumbnail: () => null
      }
    },
    $store: {
      dispatch: storeDispatch,
      state: { set: { creations: sets } },
      getters: {
        'set/creationPreview': (id) => id
      }
    }
  }
});

describe('components/set/AddItemToSetModal', () => {
  describe('create set button', () => {
    it('emits "clickCreateSet" event', () => {
      const wrapper = factory({ itemId: '/123/abc', modalId: 'add-item-to-set-modal-/123/abc' });
      wrapper.find('[data-qa="create new gallery button"]').trigger('click');

      wrapper.emitted('clickCreateSet').length.should.eql(1);
    });
  });

  describe('close button', () => {
    it('hides the modal', () => {
      const wrapper = factory({ itemId: '/123/abc', modalId: 'add-item-to-set-modal-/123/abc' });
      const bvModalHide = sinon.spy(wrapper.vm.$bvModal, 'hide');

      wrapper.find('[data-qa="close button"]').trigger('click');

      bvModalHide.should.have.been.calledWith('add-item-to-set-modal-/123/abc');
    });
  });

  describe('AddItemToSetButton', () => {
    it('adds item to gallery when item is not yet added', async() => {
      const wrapper = factory({ itemId: '/123/abc', modalId: 'add-item-to-set-modal-/123/abc' });
      await wrapper.setData({ fetched: true });

      await wrapper.find('[data-qa="toggle item button 0"]').trigger('click');

      storeDispatch.should.have.been.calledWith('set/addItem', { setId: '001', itemId: '/123/abc' });
    });

    it('removes item from gallery when item already added', async() => {
      const wrapper = factory({ itemId: '/000/aaa', modalId: 'add-item-to-set-modal-/000/aaa' });
      await wrapper.setData({ fetched: true });

      await wrapper.find('[data-qa="toggle item button 0"]').trigger('click');

      storeDispatch.should.have.been.calledWith('set/removeItem', { setId: '001', itemId: '/000/aaa' });
    });
  });
});
