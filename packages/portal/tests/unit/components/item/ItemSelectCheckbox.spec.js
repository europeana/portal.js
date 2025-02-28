import { createLocalVue, shallowMount } from '@vue/test-utils';
import ItemSelectCheckbox from '@/components/item/ItemSelectCheckbox';
import sinon from 'sinon';

const localVue = createLocalVue();

const identifier = '/001/record';

const factory = (propsData) => shallowMount(ItemSelectCheckbox, {
  localVue,
  propsData: {
    identifier,
    ...propsData
  },
  mocks: {
    $i18n: { locale: 'en' },
    $store: { commit: sinon.spy() }
  },
  stubs: ['b-form-checkbox']
});

describe('ItemSelectCheckbox', () => {
  it('renders a checkbox', () => {
    const wrapper = factory();

    expect(wrapper.find('b-form-checkbox-stub').exists()).toBe(true);
  });

  describe('selectCheckboxLabel', () => {
    const title = 'Title of an item';
    const titleLangMap = { en: title };

    describe('when it\'s of type string', () => {
      it('is used for the aria label', () => {
        const wrapper = factory({ title });

        expect(wrapper.find('b-form-checkbox-stub').attributes('aria-label')).toEqual(title);
      });
    });
    describe('when it\'s of type object (is a langmap)', () => {
      it('is used for the aria label', () => {
        const wrapper = factory({ title: titleLangMap });

        expect(wrapper.find('b-form-checkbox-stub').attributes('aria-label')).toEqual(title);
      });
    });
  });

  describe('toggleItemSelection', () => {
    describe('when value is true', () => {
      it('commits selectItem to the set store', () => {
        const wrapper = factory();

        wrapper.vm.toggleItemSelection(true);

        expect(wrapper.vm.$store.commit.calledWith('set/selectItem', identifier)).toBe(true);
      });
    });
    describe('when value is false', () => {
      it('commits deselectItem to the set store', () => {
        const wrapper = factory();

        wrapper.vm.toggleItemSelection(false);

        expect(wrapper.vm.$store.commit.calledWith('set/deselectItem', identifier)).toBe(true);
      });
    });
  });
});
