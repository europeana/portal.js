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
    items: [{ id: '/000/aaa' }],
    title: 'Test collection',
    total: 1,
    visibility: 'public'
  }
];

const factory = ({ propsData = {}, data = {} } = {}) => mount(AddItemToSetModal, {
  localVue,
  propsData: {
    modalStatic: true,
    ...propsData
  },
  data: () => ({ ...data }),
  mocks: {
    $t: () => {},
    $tc: () => {},
    $i18n: {},
    $apis: {
      set: { search: sinon.stub().resolves({ data: { items: sets } }) },
      thumbnail: { edmPreview: (img) => img?.edmPreview?.[0] }
    },
    $auth: { user: {} },
    $store: {
      dispatch: storeDispatch
    }
  }
});

describe('components/set/AddItemToSetModal', () => {
  describe('create set button', () => {
    it('emits "clickCreateSet" event', () => {
      const propsData = { itemId: '/123/abc', modalId: 'add-item-to-set-modal-/123/abc' };
      const wrapper = factory({ propsData });
      wrapper.find('[data-qa="create new gallery button"]').trigger('click');

      expect(wrapper.emitted('clickCreateSet').length).toEqual(1);
    });
  });

  describe('close button', () => {
    it('hides the modal', () => {
      const propsData = { itemId: '/123/abc', modalId: 'add-item-to-set-modal-/123/abc' };
      const wrapper = factory({ propsData });
      const bvModalHide = sinon.spy(wrapper.vm.$bvModal, 'hide');

      wrapper.find('[data-qa="close button"]').trigger('click');

      expect(bvModalHide.calledWith('add-item-to-set-modal-/123/abc')).toBe(true);
    });
  });

  describe('AddItemToSetButton', () => {
    it('adds item to gallery when item is not yet added', async() => {
      const propsData = { itemId: '/123/abc', modalId: 'add-item-to-set-modal-/123/abc' };
      const data = { fetched: true, collections: sets };
      const wrapper = factory({ propsData, data });

      await wrapper.find('[data-qa="toggle item button 0"]').trigger('click');

      expect(storeDispatch.calledWith('set/addItem', { setId: '001', itemId: '/123/abc' })).toBe(true);
    });

    it('removes item from gallery when item already added', async() => {
      const propsData = { itemId: '/000/aaa', modalId: 'add-item-to-set-modal-/000/aaa' };
      const data = { fetched: true, collections: sets };
      const wrapper = factory({ propsData, data });

      await wrapper.find('[data-qa="toggle item button 0"]').trigger('click');

      expect(storeDispatch.calledWith('set/removeItem', { setId: '001', itemId: '/000/aaa' })).toBe(true);
    });
  });
});
