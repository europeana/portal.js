import { createLocalVue, shallowMount } from '@vue/test-utils';
import sinon from 'sinon';

import ItemSelectCheckbox from '@/components/item/ItemSelectCheckbox';
import * as selectedItemsComposable from '@/composables/selectedItems.js';

const localVue = createLocalVue();

const identifier = '/001/record';
const selectItemsSpy = sinon.spy();
const deselectItemsSpy = sinon.spy();
const useSelectedItemsStub = sinon.stub(selectedItemsComposable, 'useSelectedItems');

const factory = ({ propsData, selectedItems = [] } = {}) => {
  useSelectedItemsStub.returns({
    deselect: deselectItemsSpy,
    select: selectItemsSpy,
    selected: selectedItems
  });

  return shallowMount(ItemSelectCheckbox, {
    localVue,
    propsData: {
      identifier,
      ...propsData
    },
    mocks: {
      $i18n: { locale: 'en' }
    },
    stubs: ['b-form-checkbox']
  });
};

describe('ItemSelectCheckbox', () => {
  afterEach(sinon.resetHistory);
  afterAll(sinon.resetBehavior);

  it('renders a checkbox', () => {
    const wrapper = factory();

    expect(wrapper.find('b-form-checkbox-stub').exists()).toBe(true);
  });

  describe('selectCheckboxLabel', () => {
    const title = 'Title of an item';
    const titleLangMap = { en: title };

    describe('when it\'s of type string', () => {
      it('is used for the label', () => {
        const wrapper = factory({ propsData: { title } });

        expect(wrapper.find('b-form-checkbox-stub').text()).toEqual(title);
      });
    });
    describe('when it\'s of type object (is a langmap)', () => {
      it('is used for the label', () => {
        const wrapper = factory({ propsData: { title: titleLangMap } });

        expect(wrapper.find('b-form-checkbox-stub').text()).toEqual(title);
      });
    });
  });

  describe('computed', () => {
    describe('selected', () => {
      describe('get', () => {
        describe('when the identifier exists in the store', () => {
          it('returns true', () => {
            const wrapper = factory({ selectedItems: [identifier] });

            expect(wrapper.vm.selected).toBe(true);
          });
        });
        describe('when the identifier is NOT in the store', () => {
          it('returns false', () => {
            const wrapper = factory();

            expect(wrapper.vm.selected).toBe(false);
          });
        });
      });
      describe('set', () => {
        describe('when passed value is true', () => {
          it('adds item to those selected', () => {
            const wrapper = factory();

            wrapper.vm.selected = true;

            expect(selectItemsSpy.calledWith(identifier)).toBe(true);
          });
        });
        describe('when passed value is false', () => {
          it('removes item from those selected', () => {
            const wrapper = factory();

            wrapper.vm.selected = false;

            expect(deselectItemsSpy.calledWith(identifier)).toBe(true);
          });
        });
      });
    });
  });
});
