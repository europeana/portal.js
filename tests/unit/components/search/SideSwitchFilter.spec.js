import { createLocalVue, shallowMount } from '@vue/test-utils';
import sinon from 'sinon';

import BootstrapVue from 'bootstrap-vue';
import SideSwitchFilter from '@/components/search/SideSwitchFilter';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const storeDispatchSpy = sinon.spy();

const factory = (propsData = {}, keyMock) => {
  return shallowMount(SideSwitchFilter, {
    localVue,
    propsData,
    mocks: {
      $store: {
        dispatch: storeDispatchSpy
      },
      $t: (key) => keyMock || key,
      $tFacetName: (key) => key
    }
  });
};

describe('components/search/SideSwitchFilter', () => {
  beforeEach(sinon.resetHistory);

  describe('when the value passed in matches the checked value', () => {
    it('is switched on', () => {
      const wrapper = factory({
        value: 'fulltext',
        name: 'api',
        checkedValue: 'fulltext',
        uncheckedValue: 'metadata'
      });

      const switchChecked = wrapper.find('[data-qa="api switch filter"] b-form-checkbox-stub');
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
          uncheckedValue: 'metadata',
          tooltip: 'More info'
        }, tooltipText);

        const switchChecked = wrapper.find('[data-qa="switch filter more info button"]');
        expect(switchChecked.exists()).toBe(true);
      });
    });
  });

  describe('methods', () => {
    describe('init', () => {
      it('updates localValue from value', () => {
        const wrapper = factory({
          value: 'metadata',
          name: 'api',
          checkedValue: 'fulltext',
          uncheckedValue: 'metadata',
          defaultValue: 'fulltext'
        });
        wrapper.setData({
          localValue: 'fulltext'
        });
        expect(wrapper.vm.localValue).toBe('fulltext');

        wrapper.vm.init();

        expect(wrapper.vm.localValue).toBe('metadata');
      });
    });
  });
});
