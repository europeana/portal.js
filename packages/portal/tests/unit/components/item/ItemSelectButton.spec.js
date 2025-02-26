import { createLocalVue, shallowMount } from '@vue/test-utils';
import ItemSelectButton from '@/components/item/ItemSelectButton';
import BootstrapVue from 'bootstrap-vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = () => shallowMount(ItemSelectButton, {
  localVue,
  attachTo: document.body,
  directives: { 'b-tooltip': () => {} },
  mocks: {
    $features: { itemMultiSelect: true },
    $t: (key) => key
  }
});

describe('components/item/ItemSelectButton', () => {
  describe('when itemMultiSelect feature toggle is enabled', () => {
    it('renders a button in non-selected state', () => {
      const wrapper = factory();

      const selectButton = wrapper.find('.item-select-button');

      expect(selectButton.attributes('aria-label')).toBe('set.actions.selectItems');
    });

    describe('when clicked', () => {
      it('toggles the select state', async() => {
        const wrapper = factory();

        const selectButton = wrapper.find('.item-select-button');
        selectButton.trigger('click');
        await wrapper.vm.$nextTick();

        expect(selectButton.attributes('aria-label')).toBe('set.actions.cancelSelection');
        expect(wrapper.emitted('select').length).toBe(1);
      });
    });
  });
});
