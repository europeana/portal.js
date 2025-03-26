import { createLocalVue, mount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import ItemAddButton from '@/components/item/ItemAddButton';
import sinon from 'sinon';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const identifier = '/123/abc';
const storeDispatchSuccess = sinon.spy();

const factory = ({ $auth = {}, data = {}, propsData = { identifiers: identifier }, storeDispatch = storeDispatchSuccess } = {}) => mount(ItemAddButton, {
  localVue,
  attachTo: document.body,
  propsData,
  data() {
    return { ...data };
  },
  mocks: {
    $auth,
    $keycloak: {
      login: sinon.spy()
    },
    $matomo: {
      trackEvent: sinon.spy()
    },
    $store: {
      dispatch: storeDispatch
    },
    $t: (key) => key,
    $tc: (key) => key
  },
  stubs: [
    'SetAddItemModal',
    'SetFormModal'
  ]
});

describe('components/item/ItemAddButton', () => {
  describe('template', () => {
    it('is visible', () => {
      const wrapper = factory();

      const addButton = wrapper.find('[data-qa="add button"]');

      expect(addButton.isVisible()).toBe(true);
    });

    describe('when user is not logged in', () => {
      const $auth = { loggedIn: false };

      describe('when pressed', () => {
        it('goes to login', () => {
          const wrapper = factory({ $auth });

          const addButton = wrapper.find('[data-qa="add button"]');
          addButton.trigger('click');

          expect(wrapper.vm.$keycloak.login.called).toBe(true);
        });
      });
    });

    describe('when user is logged in', () => {
      const $auth = { loggedIn: true };

      describe('when pressed', () => {
        it('shows the collection modal', async() => {
          const wrapper = factory({ $auth });

          const addButton = wrapper.find('[data-qa="add button"]');
          await addButton.trigger('click');
          const addItemModal = wrapper.find('[data-qa="add item to set modal"]');

          expect(addItemModal.isVisible()).toBe(true);
        });

        describe('when identifiers are an array (multi-select)', () => {
          it('shows the collection modal', async() => {
            const wrapper = factory({ $auth, propsData: { identifiers: ['001', '002'] } });

            const addButton = wrapper.find('[data-qa="add button"]');
            await addButton.trigger('click');
            const addItemModal = wrapper.find('[data-qa="add item to set modal"]');

            expect(addItemModal.isVisible()).toBe(true);
          });
        });
      });

      describe('when the add item modal is closed', () => {
        const data = { showAddItemModal: true };

        it('refreshes the set', async() => {
          const wrapper = factory({ $auth, data });

          await wrapper.find('[data-qa="add item to set modal"]').vm.$emit('input', false);

          expect(storeDispatchSuccess.calledWith('set/fetchActive')).toBe(true);
        });

        it('sets focus on the item add button without showing the tooltip', async() => {
          const wrapper = factory({ $auth, data });

          const addButton = wrapper.find('[data-qa="add button"]');
          addButton.trigger('focus');
          wrapper.find('[data-qa="add item to set modal"]').vm.$emit('input', false);
          await wrapper.vm.$nextTick();

          const focusedAddButton = wrapper.find('[data-qa="add button"]:focus');
          const tooltip = wrapper.find('[data-qa="add button tooltip"]');

          expect(focusedAddButton.exists()).toBe(true);
          expect(tooltip.exists()).toBe(false);
        });
      });
    });

    it('is disabled if there are no item identifiers', () => {
      const wrapper = factory({ propsData: { identifiers: [] } });

      const addButton = wrapper.find('[data-qa="add button"]');

      expect(addButton.attributes('disabled')).toBe('disabled');
    });
  });

  describe('data()', () => {
    describe('idSuffix', () => {
      describe('when there are multiple items selected', () => {
        it('ends with "multi-select"', () => {
          const wrapper = factory({
            propsData: { identifiers: ['001', '002', '003'] }
          });

          expect(wrapper.vm.idSuffix).toEqual('multi-select');
        });
      });
    });
  });

  describe('methods', () => {
    describe('clickCreateSet', () => {
      it('shows the form modal', async() => {
        const wrapper = factory();
        await wrapper.vm.clickCreateSet();

        expect(wrapper.vm.showFormModal).toBe(true);
      });
    });
    describe('setCreatedOrUpdated', () => {
      it('shows the create/update modal', async() => {
        const wrapper = factory();
        await wrapper.vm.setCreatedOrUpdated();

        expect(wrapper.vm.newSetCreated).toBe(true);
      });
    });
    describe('refreshSet', () => {
      it('refreshes the set', async() => {
        const wrapper = factory();
        await wrapper.vm.refreshSet();

        expect(storeDispatchSuccess.calledWith('set/fetchActive')).toBe(true);
      });
    });
  });
});
