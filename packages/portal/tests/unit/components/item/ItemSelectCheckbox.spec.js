import { createLocalVue, shallowMount } from '@vue/test-utils';
import ItemSelectCheckbox from '@/components/item/ItemSelectCheckbox';
import sinon from 'sinon';

const localVue = createLocalVue();

const identifier = '/001/record';

const factory = ({ propsData, store } = {}) => shallowMount(ItemSelectCheckbox, {
  localVue,
  propsData: {
    identifier,
    ...propsData
  },
  mocks: {
    $i18n: { locale: 'en' },
    $store: {
      state: {
        set: {
          selectedItems: []
        }
      },
      commit: sinon.spy(),
      ...store
    }
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
            const store = {
              state: {
                set: {
                  selectedItems: [identifier]
                }
              }
            };
            const wrapper = factory({ store });
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
          it('commits selectItem to the set store', () => {
            const wrapper = factory();

            wrapper.vm.selected = true;

            expect(wrapper.vm.$store.commit.calledWith('set/selectItem', identifier)).toBe(true);
          });
        });
        describe('when passed value is false', () => {
          it('commits deselectItem to the set store', () => {
            const wrapper = factory();

            wrapper.vm.selected = false;

            expect(wrapper.vm.$store.commit.calledWith('set/deselectItem', identifier)).toBe(true);
          });
        });
      });
    });
  });
});
