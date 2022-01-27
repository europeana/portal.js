import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import SideSwitchFilter from '@/components/search/SideSwitchFilter';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = (propsData = {}) => {
  return shallowMount(SideSwitchFilter, {
    localVue,
    propsData,
    mocks: {
      $t: (key) => key,
      $tFacetName: (key) => key
    }
  });
};

describe('components/search/SideSwitchFilter', () => {
  describe('when the value passed in matches the checked value', () => {
    it('is switched on', () => {
      const wrapper = factory({
        value: 'fulltext',
        name: 'api',
        checkedValue: 'fulltext',
        uncheckedValue: 'metadata'
      });

      const switchChecked = wrapper.find('[data-qa="api switch filter"]');
      expect(switchChecked.attributes('checked')).toBe('fulltext');
    });
  });
});
