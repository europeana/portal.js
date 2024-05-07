import { createLocalVue, mount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import SetAddItemModal from '@/components/set/SetAddItemModal';
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

const factory = ({ propsData = {}, data = {} } = {}) => mount(SetAddItemModal, {
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
      set: { search: sinon.stub().resolves({ data: { items: sets } }) }
    },
    $auth: { user: { sub: 'user-id' } },
    $store: {
      dispatch: storeDispatch
    }
  }
});

describe('components/set/SetAddItemModal', () => {
  describe('template', () => {
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

    describe('toggle item button', () => {
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

  describe('methods', () => {
    describe('fetchCollections', () => {
      it('queries Set API for user\'s sets', async() => {
        const propsData = { itemId: '/000/aaa' };
        const wrapper = factory({ propsData });

        await wrapper.vm.fetchCollections();

        expect(wrapper.vm.$apis.set.search.calledWith({
          query: 'creator:user-id',
          profile: 'standard',
          pageSize: 100,
          page: 0,
          qf: ['type:Collection']
        })).toBe(true);
      });

      it('stores sets from the Set API response', async() => {
        const propsData = { itemId: '/000/aaa' };
        const wrapper = factory({ propsData });

        await wrapper.vm.fetchCollections();

        expect(wrapper.vm.collections).toEqual(sets);
      });
    });
  });
});
