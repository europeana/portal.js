import { createLocalVue, mount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import sinon from 'sinon';
import SetAddItemModal from '@/components/set/SetAddItemModal';
import * as useMakeToast from '@/composables/makeToast.js';

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
    $t: (key) => key,
    $tc: (key) => key,
    $i18n: {},
    $apis: {
      set: {
        deleteItems: setApiDeleteItemsStub,
        insertItems: setApiInsertItemsStub,
        search: sinon.stub().resolves({ items: sets })
      }
    },
    $auth: { user: { sub: 'user-id' } }
  },
  stubs: ['ConfirmDangerModal']
});

describe('components/set/SetAddItemModal', () => {
  beforeAll(() => {
    sinon.stub(useMakeToast, 'default').returns({
      makeToast: sinon.spy()
    });
  });
  afterEach(sinon.resetHistory);
  afterAll(sinon.reset);

  describe('template', () => {
    describe('create set button', () => {
      it('emits "clickCreateSet" event', () => {
        const propsData = { itemIds: '/123/abc', modalId: 'add-item-to-set-modal-/123/abc' };
        const wrapper = factory({ propsData });
        wrapper.find('[data-qa="create new gallery button"]').trigger('click');

        expect(wrapper.emitted('clickCreateSet').length).toEqual(1);
      });
    });

    describe('close button', () => {
      it('hides the modal', () => {
        const propsData = { itemIds: '/123/abc', modalId: 'add-item-to-set-modal-/123/abc' };
        const wrapper = factory({ propsData });
        const bvModalHide = sinon.spy(wrapper.vm.$bvModal, 'hide');

        wrapper.find('[data-qa="close button"]').trigger('click');

        expect(bvModalHide.calledWith('add-item-to-set-modal-/123/abc')).toBe(true);
      });
    });

    describe('toggle item button', () => {
      describe('when item is not yet added', () => {
        it('adds item to gallery', async() => {
          const propsData = { itemIds: '/123/abc', modalId: 'add-item-to-set-modal-/123/abc' };
          const data = { fetched: true, collections: sets };
          const wrapper = factory({ propsData, data });

          await wrapper.find('[data-qa="toggle item button 0"]').trigger('click');

          expect(setApiInsertItemsStub.calledWith('001', '/123/abc')).toBe(true);
          expect(wrapper.vm.makeToast.calledWith('set.notifications.itemsAdded.1')).toBe(true);
        });
      });

      describe('when item is already added', () => {
        it('shows the removal confirmation modal first, without removing the item yet', async() => {
          const propsData = { itemIds: '/000/aaa', modalId: 'add-item-to-set-modal-/000/aaa' };
          const data = { fetched: true, collections: sets, collectionsWithItem: ['001'] };
          const wrapper = factory({ propsData, data });

          await wrapper.find('[data-qa="toggle item button 0"]').trigger('click');
          const confirmRemovalModal = wrapper.find('[data-qa="confirm removal modal"]');

          expect(confirmRemovalModal.isVisible()).toBe(true);
          expect(setApiDeleteItemsStub.called).toBe(false);
        });

        describe('when the removal confirmation modal emits the confirm event', () => {
          it('removes item from gallery', async() => {
            const propsData = { itemIds: '/000/aaa', modalId: 'add-item-to-set-modal-/000/aaa' };
            const data = { fetched: true, collections: sets, collectionsWithItem: ['001'] };
            const wrapper = factory({ propsData, data });

            await wrapper.find('[data-qa="toggle item button 0"]').trigger('click');
            const confirmRemovalModal = wrapper.find('[data-qa="confirm removal modal"]');
            await confirmRemovalModal.vm.$emit('confirm');

            expect(wrapper.vm.makeToast.calledWith('set.notifications.itemsRemoved.1')).toBe(true);
          });
        });
      });
    });
  });

  describe('methods', () => {
    describe('fetchCollections', () => {
      it('queries Set API for user\'s sets', async() => {
        const propsData = { itemIds: '/000/aaa' };
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
        const propsData = { itemIds: '/000/aaa' };
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

      describe('when items in an array (multi-select)', () => {
        it('queries Set API for user\'s sets specific to all the items', async() => {
          const propsData = { itemIds: ['/000/aaa', '/111/bbb'] };
          const wrapper = factory({ propsData });

          await wrapper.vm.fetchCollections();

          expect(wrapper.vm.$apis.set.search.calledWith({
            query: 'creator:user-id',
            profile: 'items',
            pageSize: 100,
            page: 1,
            qf: [
              'item:http://data.europeana.eu/item/000/aaa',
              'item:http://data.europeana.eu/item/111/bbb',
              'type:Collection'
            ]
          })).toBe(true);
        });
      });

      it('stores sets from the Set API response', async() => {
        const propsData = { itemIds: '/000/aaa' };
        const wrapper = factory({ propsData });

        await wrapper.vm.fetchCollections();

        expect(wrapper.vm.collections).toEqual(sets);
      });
    });
  });
});
