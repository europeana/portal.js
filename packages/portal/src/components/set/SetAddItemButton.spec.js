import { createLocalVue, mount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import SetAddItemButton from '@/components/set/SetAddItemButton';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const collection =
  {
    id: '001',
    items: ['http://data.europeana.eu/item/000/aaa'],
    title: 'Test collection',
    total: 1,
    visibility: 'public'
  };

const factory = (propsData = {}) => mount(SetAddItemButton, {
  localVue,
  propsData: {
    ...propsData
  },
  mocks: {
    $tc: () => {},
    $i18n: {}
  }
});

describe('components/set/SetAddItemButton', () => {
  describe('when an item is not yet added it', () => {
    it('does not show a check icon', () => {
      const wrapper = factory({ set: collection });

      expect(wrapper.find('[data-qa="toggle item button"] .icon-check-circle').exists()).toBe(false);
    });
  });

  describe('when an item is added it', () => {
    it('displays as a success button and shows a check icon', () => {
      const wrapper = factory({ set: collection, checked: true, added: true });

      expect(wrapper.find('[data-qa="toggle item button"].btn-success').exists()).toBe(true);
      expect(wrapper.find('[data-qa="toggle item button"] .icon-check-circle').exists()).toBe(true);
    });
  });
});
