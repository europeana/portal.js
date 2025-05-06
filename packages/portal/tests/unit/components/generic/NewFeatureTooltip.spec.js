import { createLocalVue, shallowMount } from '@vue/test-utils';
import NewFeatureTooltip from '@/components/generic/NewFeatureTooltip';
import sinon from 'sinon';

const localVue = createLocalVue();

const factory = () => shallowMount(NewFeatureTooltip, {
  localVue,
  propsData: { tooltipTargetId: 'tooltip-target' },
  data: () => ({ featureNotificationName: 'newFeature' }),
  mocks: {
    $t: () => {},
    $cookies: {
      get: () => null,
      set: sinon.spy()
    },
    $matomo: {
      trackEvent: sinon.spy()
    }
  },
  stubs: ['b-button', 'b-tooltip']
});

describe('components/generic/NewFeatureTooltip', () => {
  it('sets a cookie for this new feature tooltip', async() => {
    const wrapper = factory();

    const setCookie = wrapper.vm.$cookies.set;

    await wrapper.vm.$nextTick();

    expect(setCookie.calledWith('new_feature_tooltip', 'newFeature')).toBe(true);
  });

  it('tracks the showing of the component in matomo', async() => {
    const wrapper = factory();
    const mtmTrackEvent = wrapper.vm.$matomo.trackEvent;
    await wrapper.vm.$nextTick();

    expect(mtmTrackEvent.calledWith('New_feature_tooltip', 'show', 'newFeature')).toBe(true);
  });

  it('shows a "close" button', () => {
    const wrapper = factory();

    const closeButton = wrapper.find('b-button-stub .icon-clear');

    expect(closeButton.exists()).toBe(true);
  });
});
