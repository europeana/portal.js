import { createLocalVue, shallowMount } from '@vue/test-utils';
import ItemRemoveButton from '@/components/item/ItemRemoveButton';
import BootstrapVue from 'bootstrap-vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = (propsData) => shallowMount(ItemRemoveButton, {
  localVue,
  directives: { 'b-tooltip': () => {} },
  propsData,
  mocks: {
    $store: {
      state: {
        set: {
          active: {
            id: 'set-1'
          }
        }
      },
      dispatch: jest.fn()
    },
    $t: key => key
  }
});

describe('ItemRemoveButton', () => {
  it('renders the button icon only', () => {
    const wrapper = factory({ identifier: 'item-1' });

    expect(wrapper.find('[data-qa="item remove button"]').classes()).toContain('button-icon-only');
  });

  it('calls the removeItem method when clicked', async() => {
    const wrapper = factory({ identifier: 'item-1' });

    await wrapper.find('[data-qa="item remove button"]').trigger('click');

    expect(wrapper.vm.$store.dispatch).toHaveBeenCalledWith('set/removeItem', {
      setId: 'set-1',
      itemId: 'item-1'
    });
    expect(wrapper.vm.$store.dispatch).toHaveBeenCalledWith('set/refreshSet');
  });
});
