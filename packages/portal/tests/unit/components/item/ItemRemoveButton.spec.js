import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import sinon from 'sinon';
import ItemRemoveButton from '@/components/item/ItemRemoveButton';
import * as useMakeToast from '@/composables/makeToast.js';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const setApiDeleteItemsStub = sinon.stub().resolves({});

const factory = (propsData) => shallowMount(ItemRemoveButton, {
  localVue,
  directives: { 'b-tooltip': () => {} },
  propsData,
  mocks: {
    $apis: {
      set: {
        deleteItems: setApiDeleteItemsStub
      }
    },
    $i18n: { locale: 'en' },
    $store: {
      state: {
        set: {
          active: {
            id: 'set-1'
          }
        }
      },
      dispatch: sinon.spy()
    },
    $t: key => key,
    $tc: (key) => key
  },
  stubs: ['ConfirmDangerModal']
});

describe('ItemRemoveButton', () => {
  beforeAll(() => {
    sinon.stub(useMakeToast, 'default').returns({
      makeToast: sinon.spy()
    });
  });
  afterEach(sinon.resetHistory);
  afterAll(sinon.reset);

  it('renders the button icon only', () => {
    const wrapper = factory({ identifiers: 'item-1' });

    expect(wrapper.find('[data-qa="item remove button"]').classes()).toContain('button-icon-only');
  });

  it('first shows the confirmation modal, without removing the item yet', async() => {
    const wrapper = factory({ identifiers: 'item-1' });

    await wrapper.find('[data-qa="item remove button"]').trigger('click');
    const confirmRemovalModal = wrapper.find('[data-qa="confirm removal modal"]');

    expect(confirmRemovalModal.isVisible()).toBe(true);
    expect(setApiDeleteItemsStub.called).toBe(false);
  });

  it('removes the item once the modal emit confirm event', async() => {
    const wrapper = factory({ identifiers: 'item-1' });

    await wrapper.find('[data-qa="item remove button"]').trigger('click');
    const confirmRemovalModal = wrapper.find('[data-qa="confirm removal modal"]');
    await confirmRemovalModal.vm.$emit('confirm');

    expect(setApiDeleteItemsStub.calledWith('set-1', 'item-1')).toBe(true);
    expect(wrapper.vm.$store.dispatch.calledWith('set/fetchActive')).toBe(true);
    expect(wrapper.vm.makeToast.calledWith('set.notifications.itemsRemoved.1')).toBe(true);
  });

  it('is disabled if there are no item identifiers', () => {
    const wrapper = factory({ identifiers: [] });

    const button = wrapper.find('[data-qa="item remove button"]');

    expect(button.attributes('disabled')).toBe('true');
  });
});
