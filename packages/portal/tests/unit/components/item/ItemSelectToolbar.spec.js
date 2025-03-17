import { createLocalVue, shallowMount } from '@vue/test-utils';
import ItemSelectToolbar from '@/components/item/ItemSelectToolbar';
import BootstrapVue from 'bootstrap-vue';
import sinon from 'sinon';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = ({ propsData = {}, mocks = {}, store = {} } = {}) => shallowMount(ItemSelectToolbar, {
  propsData: {
    ...propsData
  },
  localVue,
  mocks: {
    $features: { itemMultiSelect: true },
    $store: {
      commit: sinon.spy(),
      state: {
        set: {
          selectedItems: []
        }
      },
      ...store
    },
    $t: (key) => key,
    $tc: (key, count) => `${count} ${key}`,
    ...mocks
  },
  stubs: ['ItemRemoveButton', 'ItemAddButton', 'ItemLikeButton']
});

describe('components/item/ItemSelectToolbar', () => {
  describe('when itemMultiSelect feature toggle is enabled', () => {
    it('renders the toolbar', () => {
      const wrapper = factory();

      const selectionToolbar = wrapper.find('.item-select-toolbar');

      expect(selectionToolbar.text()).toBe('0 set.toolbar.info');
    });
  });

  describe('when no items are selected', () => {
    it('does not render the add and like buttons', () => {
      const wrapper = factory();

      const addButton = wrapper.find('itemaddbutton-stub');
      const likeButton = wrapper.find('itemlikebutton-stub');

      expect(addButton.exists()).toBe(false);
      expect(likeButton.exists()).toBe(false);
    });
  });

  describe('when items are selected', () => {
    const store = {
      state: {
        set: {
          selectedItems: ['123/abc', '456/def']
        }
      }
    };

    it('renders the add and like buttons', () => {
      const wrapper = factory({ store });

      const addButton = wrapper.find('itemaddbutton-stub');
      const likeButton = wrapper.find('itemlikebutton-stub');

      expect(addButton.exists()).toBe(true);
      expect(likeButton.exists()).toBe(true);
    });

    describe('remove selected button', () => {
      describe('when the user has rights to edit the set', () => {
        it('renders the remove button', () => {
          const wrapper = factory({ propsData: { userCanEditSet: true }, store });

          const removeButton = wrapper.find('itemremovebutton-stub');

          expect(removeButton.exists()).toBe(true);
        });
      });

      describe('when the user does NOT have rights to edit the set', () => {
        it('does not render the remove button', () => {
          const wrapper = factory({ propsData: { userCanEditSet: false }, store });

          const removeButton = wrapper.find('itemremovebutton-stub');

          expect(removeButton.exists()).toBe(false);
        });
      });
    });

    describe('deselect selected button', () => {
      describe('on click', () => {
        it('resets the selected state in the store', () => {
          const wrapper = factory({ store });

          const deselectButton = wrapper.find('.deselect-selected-button');
          deselectButton.trigger('click');

          expect(wrapper.vm.$store.commit.calledWith('set/setSelected', [])).toBe(true);
        });
      });
    });
  });
});
