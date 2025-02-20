import { createLocalVue, shallowMount } from '@vue/test-utils';
import ItemSelectButton from '@/components/item/ItemSelectButton';

const localVue = createLocalVue();

const factory = () => shallowMount(ItemSelectButton, {
  localVue,
  attachTo: document.body,
  directives: { 'b-tooltip': () => {} },
  mocks: {
    $t: (key) => key
  },
  stubs: ['b-button']
});

describe('components/item/ItemSelectButton', () => {
  describe('template', () => {
    it('defaults to deselected', () => {
      const wrapper = factory();

      const selectButton = wrapper.find('[data-qa="item select button"]');

      expect(selectButton.text()).toBe('actions.select');
    });

    it('toggles select state when clicked', async() => {
      const wrapper = factory();

      const selectButton = wrapper.find('[data-qa="item select button"]');
      selectButton.vm.$emit('click');
      await (wrapper.vm.$nextTick());

      expect(selectButton.text()).toBe('actions.deselect');
    });
  });
});
