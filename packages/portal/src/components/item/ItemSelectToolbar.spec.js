import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import sinon from 'sinon';

import ItemSelectToolbar from '@/components/item/ItemSelectToolbar';
import * as selectedItemsComposable from '@/composables/selectedItems.js';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const clearSelectedItemsSpy = sinon.spy();
const useSelectedItemsStub = sinon.stub(selectedItemsComposable, 'useSelectedItems');

const factory = ({ propsData = {}, mocks = {}, selectedItems = [], store = {} } = {}) => {
  useSelectedItemsStub.returns({
    clear: clearSelectedItemsSpy,
    selected: selectedItems
  });

  return shallowMount(ItemSelectToolbar, {
    propsData: {
      ...propsData
    },
    localVue,
    mocks: {
      $features: { itemMultiSelect: true },
      $store: {
        commit: sinon.spy(),
        state: {
          set: {}
        },
        ...store
      },
      $t: (key) => key,
      $tc: (key, count) => `${count} ${key}`,
      ...mocks
    },
    stubs: ['ItemRemoveButton', 'ItemAddButton', 'ItemLikeButton']
  });
};

describe('components/item/ItemSelectToolbar', () => {
  afterEach(sinon.resetHistory);
  afterAll(sinon.resetBehavior);

  describe('when itemMultiSelect feature toggle is enabled', () => {
    it('renders the toolbar', () => {
      const wrapper = factory();

      const selectionToolbar = wrapper.find('.item-select-toolbar');

      expect(selectionToolbar.isVisible()).toBe(true);
    });
  });

  describe('when no items are selected', () => {
    it('does not show the deselect selected button', () => {
      const wrapper = factory();

      const deselectSelectedButton = wrapper.find('.deselect-selected-button');

      expect(deselectSelectedButton.isVisible()).toBe(false);
    });

    it('does not show the add and like buttons', () => {
      const wrapper = factory();

      const addButton = wrapper.find('itemaddbutton-stub');
      const likeButton = wrapper.find('itemlikebutton-stub');

      expect(addButton.isVisible()).toBe(false);
      expect(likeButton.isVisible()).toBe(false);
    });
  });

  describe('when items are selected', () => {
    const selectedItems = ['123/abc', '456/def'];
    const store = {
      state: {
        set: {
          active: { items: [{ id: '123/abc' }] }
        }
      }
    };

    it('shows the deselect selected button', () => {
      const wrapper = factory({ selectedItems, store });

      const deselectSelectedButton = wrapper.find('.deselect-selected-button');

      expect(deselectSelectedButton.isVisible()).toBe(true);
    });

    it('shows the add and like buttons', () => {
      const wrapper = factory({ selectedItems, store });

      const addButton = wrapper.find('itemaddbutton-stub');
      const likeButton = wrapper.find('itemlikebutton-stub');

      expect(addButton.isVisible()).toBe(true);
      expect(likeButton.isVisible()).toBe(true);
    });

    describe('remove selected button', () => {
      describe('when the user has rights to edit the set', () => {
        describe('and the selected items are in the active set', () => {
          it('renders the remove button', () => {
            const wrapper = factory({
              propsData: { userCanEditSet: true },
              selectedItems,
              store
            });

            const removeButton = wrapper.find('itemremovebutton-stub');

            expect(removeButton.exists()).toBe(true);
          });
        });

        describe('but the selected items are not the active set', () => {
          const selectedItems = ['789/ghi'];

          it('does not render the remove button', () => {
            const wrapper = factory({
              propsData: { userCanEditSet: true },
              selectedItems,
              store
            });

            const removeButton = wrapper.find('itemremovebutton-stub');

            expect(removeButton.exists()).toBe(false);
          });
        });
      });

      describe('when the user does not have rights to edit the set', () => {
        it('does not render the remove button', () => {
          const wrapper = factory({ propsData: { userCanEditSet: false }, selectedItems, store });

          const removeButton = wrapper.find('itemremovebutton-stub');

          expect(removeButton.exists()).toBe(false);
        });
      });
    });

    describe('deselect selected button', () => {
      describe('on click', () => {
        it('clears the selected items', () => {
          const wrapper = factory({ selectedItems, store });

          const deselectButton = wrapper.find('.deselect-selected-button');
          deselectButton.trigger('click');

          expect(clearSelectedItemsSpy.calledWith()).toBe(true);
        });
      });
    });
  });
});
