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
          uncheckedValue: 'metadata',
          tooltip: 'More info'
        }, tooltipText);

        const switchChecked = wrapper.find('[data-qa="switch filter more info button"]');
        expect(switchChecked.exists()).toBe(true);
      });
    });
  });

  it('records the filter as resettable in the store', () => {
    const wrapper = factory({
      value: 'fulltext',
      name: 'api',
      checkedValue: 'fulltext',
      uncheckedValue: 'metadata'
    });

    expect(storeDispatchSpy.calledWith(
      'search/setResettableFilter',
      {
        name: 'api',
        selected: 'fulltext'
      }
    )).toBe(true);
  });
});
