import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import SideSwitchFilter from '@/components/search/SideSwitchFilter';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = (propsData = {}, keyMock) => {
  return shallowMount(SideSwitchFilter, {
    localVue,
    propsData,
    mocks: {
      $t: (key) => keyMock || key,
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

  describe('more info button', () => {
    describe('when a string is provided', () => {
      it('is rendered', () => {
        const tooltipText = 'Some more info on what this filter does';
        const wrapper = factory({
          value: 'fulltext',
          name: 'api',
          checkedValue: 'fulltext',
          uncheckedValue: 'metadata'
        }, tooltipText);

        const switchChecked = wrapper.find('[data-qa="switch filter more info button"]');
        expect(switchChecked.exists()).toBe(true);
      });
    });
  });

  describe('computed', () => {
    describe('labelText', () => {
      it('translates labelKey prop if supplied', () => {
        const wrapper = factory({
          name: 'api',
          labelKey: 'facets.api'
        });

        const labelText = wrapper.vm.labelText;

        expect(labelText).toBe('facets.api');
      });

      it('otherwise translates key derived from name prop', () => {
        const wrapper = factory({
          name: 'api'
        });

        const labelText = wrapper.vm.labelText;

        expect(labelText).toBe('facets.api.switch');
      });
    });
  });
});
