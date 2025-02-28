import { createLocalVue, shallowMount } from '@vue/test-utils';
import ItemSelectCheckbox from '@/components/item/ItemSelectCheckbox';

const localVue = createLocalVue();

const factory = (propsData) => shallowMount(ItemSelectCheckbox, {
  localVue,
  propsData,
  mocks: {
    $i18n: { locale: 'en' }
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
});
