import { createLocalVue, shallowMount } from '@vue/test-utils';
import NewFeatureTooltip from '@/components/generic/NewFeatureTooltip';
import sinon from 'sinon';

const localVue = createLocalVue();

const featureNotificationName = 'newFeature';

const factory = ({ data = {}, mocks = {} } = {}) => shallowMount(NewFeatureTooltip, {
  localVue,
  propsData: { tooltipTargetId: 'tooltip-target' },
  data: () => ({ featureNotificationName, ...data }),
  mocks: {
    $cookies: {
      get: () => null,
      set: sinon.spy()
    },
    $matomo: {
      trackEvent: sinon.spy()
    },
    $t: () => {},
    ...mocks
  },
  stubs: ['b-button', 'b-tooltip']
});

describe('components/generic/NewFeatureTooltip', () => {
  it('is enabled if cookie not set and there is an active feature notification', () => {
    const wrapper = factory();

    const tooltip = wrapper.find('b-tooltip-stub');

    expect(tooltip.isVisible()).toBe(true);
  });

  it('is not enabled if cookie is already set', async() => {
    const mocks = { $cookies: { get: () => featureNotificationName } };
    const wrapper = factory({ mocks });

    const tooltip = wrapper.find('b-tooltip-stub');

    expect(tooltip.exists()).toBe(false);
  });

  it('is not enabled if no active feature notification', async() => {
    const data = { featureNotificationName: undefined };
    const wrapper = factory({ data });

    const tooltip = wrapper.find('b-tooltip-stub');

    expect(tooltip.exists()).toBe(false);
  });

  it('sets a cookie for this new feature tooltip', async() => {
    const wrapper = factory();

    const setCookie = wrapper.vm.$cookies.set;

    await wrapper.vm.$nextTick();

    expect(setCookie.calledWith('new_feature_tooltip', featureNotificationName)).toBe(true);
  });

  it('tracks the showing of the component in matomo', async() => {
    const wrapper = factory();
    const mtmTrackEvent = wrapper.vm.$matomo.trackEvent;
    await wrapper.vm.$nextTick();

    expect(mtmTrackEvent.calledWith('New_feature_tooltip', 'show', featureNotificationName)).toBe(true);
  });

  it('shows a "close" button', () => {
    const wrapper = factory();

    const closeButton = wrapper.find('b-button-stub .icon-clear');

    expect(closeButton.exists()).toBe(true);
  });
});
