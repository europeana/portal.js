import { createLocalVue, mount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import SetAddItemModal from '@/components/set/SetAddItemModal';
import sinon from 'sinon';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const setApiInsertItemsStub = sinon.stub().resolves({});
const setApiDeleteItemsStub = sinon.stub().resolves({});

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
    $t: key => key,
    $tc: () => {},
    $i18n: {},
    $apis: {
      set: {
        deleteItems: setApiDeleteItemsStub,
        insertItems: setApiInsertItemsStub,
        search: sinon.stub().resolves({ items: sets })
      }
    },
    $auth: { user: { sub: 'user-id' } }
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
        const makeToast = sinon.spy(wrapper.vm, 'makeToast');

        await wrapper.find('[data-qa="toggle item button 0"]').trigger('click');

        expect(setApiInsertItemsStub.calledWith('001', '/123/abc')).toBe(true);
        expect(makeToast.calledWith('set.notifications.itemAdded')).toBe(true);
      });

      it('removes item from gallery when item already added', async() => {
        const propsData = { itemId: '/000/aaa', modalId: 'add-item-to-set-modal-/000/aaa' };
        const data = { fetched: true, collections: sets, collectionsWithItem: ['001'] };
        const wrapper = factory({ propsData, data });
        const makeToast = sinon.spy(wrapper.vm, 'makeToast');

        await wrapper.find('[data-qa="toggle item button 0"]').trigger('click');

        expect(setApiDeleteItemsStub.calledWith('001', '/000/aaa')).toBe(true);
        expect(makeToast.calledWith('set.notifications.itemRemoved')).toBe(true);
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
          profile: 'items.meta',
          pageSize: 100,
          page: 1,
          qf: ['type:Collection']
        })).toBe(true);
      });

      it('queries Set API for user\'s sets specific to the item', async() => {
        const propsData = { itemId: '/000/aaa' };
        const wrapper = factory({ propsData });

        await wrapper.vm.fetchCollections();

        expect(wrapper.vm.$apis.set.search.calledWith({
          query: 'creator:user-id',
          profile: 'items',
          pageSize: 100,
          page: 1,
          qf: ['item:http://data.europeana.eu/item/000/aaa', 'type:Collection']
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
