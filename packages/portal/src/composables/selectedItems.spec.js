import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '@test/utils.js';
import sinon from 'sinon';

import { useSelectedItems } from '@/composables/selectedItems.js';

const component = (...args) => ({
  template: '<span />',
  setup() {
    const { clear, deselect, selected, select } = useSelectedItems(...args);
    return { clear, deselect, selected, select };
  }
});

const factory = (...args) => shallowMountNuxt(component(...args), {
  localVue: createLocalVue()
});

describe('useSelectedItems', () => {
  afterEach(() => {
    sinon.resetHistory();
  });
  afterAll(() => {
    sinon.resetBehavior();
  });

  describe('selected', () => {
    it('defaults to []', () => {
      const wrapper = factory();

      const selected = wrapper.vm.selected;

      expect(selected).toEqual([]);
    });

    it('accepts initial items as composable arg', () => {
      const selectedItems = ['a'];
      const wrapper = factory(selectedItems);

      const selected = wrapper.vm.selected;

      expect(selected).toEqual(selectedItems);
    });
  });

  describe('select', () => {
    it('adds item to selected', () => {
      const item = 'b';
      const wrapper = factory();
      expect(wrapper.vm.selected.includes(item)).toBe(false);

      wrapper.vm.select(item);

      expect(wrapper.vm.selected.includes(item)).toBe(true);
    });
  });

  describe('deselect', () => {
    it('remove item from selected', () => {
      const item = 'c';
      const wrapper = factory([item]);
      expect(wrapper.vm.selected.includes(item)).toBe(true);

      wrapper.vm.deselect(item);

      expect(wrapper.vm.selected.includes(item)).toBe(false);
    });
  });

  describe('clear', () => {
    it('resets selected to []', () => {
      const items = ['d', 'e'];
      const wrapper = factory(items);
      expect(wrapper.vm.selected.length).toBe(items.length);

      wrapper.vm.clear();

      expect(wrapper.vm.selected.length).toBe(0);
    });
  });
});
