import { createLocalVue, shallowMount } from '@vue/test-utils';
import ItemRemoveButton from '@/components/item/ItemRemoveButton';
import BootstrapVue from 'bootstrap-vue';
import sinon from 'sinon';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const setApiDeleteItemStub = sinon.stub().resolves({});

const factory = (propsData) => shallowMount(ItemRemoveButton, {
  localVue,
  directives: { 'b-tooltip': () => {} },
  propsData,
  mocks: {
    $apis: {
      set: {
        deleteItems: setApiDeleteItemStub
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
    $t: key => key
  }
});

describe('ItemRemoveButton', () => {
  it('renders the button icon only', () => {
    const wrapper = factory({ identifier: 'item-1' });

    expect(wrapper.find('[data-qa="item remove button"]').classes()).toContain('button-icon-only');
  });

  it('calls the deleteItems method when clicked', async() => {
    const wrapper = factory({ identifier: 'item-1' });
    const makeToast = sinon.spy(wrapper.vm, 'makeToast');

    await wrapper.find('[data-qa="item remove button"]').trigger('click');

    expect(setApiDeleteItemStub.calledWith('set-1', 'item-1')).toBe(true);
    expect(wrapper.vm.$store.dispatch.calledWith('set/refreshSet')).toBe(true);
    expect(makeToast.calledWith('set.notifications.itemRemoved')).toBe(true);
  });
});
