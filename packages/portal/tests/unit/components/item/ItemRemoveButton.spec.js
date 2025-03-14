import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import sinon from 'sinon';
import ItemRemoveButton from '@/components/item/ItemRemoveButton';
import * as useMakeToast from '@/composables/makeToast.js';

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
    $t: key => key,
    $tc: (key) => key
  }
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

  it('calls the deleteItems method when clicked', async() => {
    const wrapper = factory({ identifiers: 'item-1' });

    await wrapper.find('[data-qa="item remove button"]').trigger('click');

    expect(setApiDeleteItemStub.calledWith('set-1', 'item-1')).toBe(true);
    expect(wrapper.vm.$store.dispatch.calledWith('set/refreshSet')).toBe(true);
    expect(wrapper.vm.makeToast.calledWith('set.notifications.itemsRemoved.one')).toBe(true);
  });
});
