import { createLocalVue, mount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import AddItemToSetModal from '@/components/set/AddItemToSetModal';
import sinon from 'sinon';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const storeDispatch = sinon.stub().resolves({});
const apiSearch = sinon.stub().resolves({ data: { items: ['result'] } });

const sets = [
  { id: '001',
    items: [{ id: '/000/aaa' }],
    title: 'Test collection',
    total: 1,
    visibility: 'public' }
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
    $auth: {
      user: {
        sub: 'userID'
      }
    },
    $apis: {
      set: {
        getSetThumbnail: () => null,
        search: apiSearch
      }
    },
    $store: {
      dispatch: storeDispatch,
      state:
        { set: { creations: sets } }
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

  describe('toggle item button', () => {
    it('adds item to gallery when item is not yet added', async() => {
      const wrapper = factory({ itemId: '/123/abc', modalId: 'add-item-to-set-modal-/123/abc' });
      await wrapper.setData({ gettingGalleries: false, searchResults: sets });

      await wrapper.find('[data-qa="toggle item button 0"]').trigger('click');

      storeDispatch.should.have.been.calledWith('set/addItem', { setId: '001', itemId: '/123/abc' });
    });
    it('removes item from gallery when item already added', async() => {
      const wrapper = factory({ itemId: '/000/aaa', modalId: 'add-item-to-set-modal-/000/aaa' });
      await wrapper.setData({ gettingGalleries: false, searchResults: sets });

      await wrapper.find('[data-qa="toggle item button 0"]').trigger('click');

      storeDispatch.should.have.been.calledWith('set/removeItem', { setId: '001', itemId: '/000/aaa' });
    });
  });

  describe('searchGalleries', () => {
    context('while a search is in progress', () => {
      it('does not search again', async() => {
        const wrapper = factory({ itemId: '/000/aaa', modalId: 'add-item-to-set-modal-/000/aaa' });
        await wrapper.setData({ gettingGalleries: true });
        wrapper.vm.searchGalleries('new query');
        apiSearch.should.not.have.been.called;
      });
    });
    context('when searching for a new query term', () => {
      it('calls the set api search', async() => {
        const wrapper = factory({ itemId: '/000/aaa', modalId: 'add-item-to-set-modal-/000/aaa' });
        await wrapper.setData({ gettingGalleries: false, galleryQuery: 'new query' });
        wrapper.vm.searchGalleries('new query');

        const params = {
          query: 'new query',
          profile: 'itemDescriptions',
          pageSize: 5,
          qf: ['creator:userID', 'type:Collection'],
          sort: 'modified+desc'
        };

        const expectedParams = new URLSearchParams(params);

        apiSearch.should.have.been.calledWith(expectedParams);
        wrapper.vm.$nextTick(() => {
          wrapper.vm.searchResults.should.eq(['result']);
        });
      });
    });
  });
});
