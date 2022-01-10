import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import NewFeatureNotification from '@/components/generic/NewFeatureNotification.vue';
import sinon from 'sinon';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = (propsData = {}) => shallowMount(NewFeatureNotification, {
  localVue,
  propsData,
  mocks: {
    $t: () => {},
    $cookies: {
      set: () => {}
    },
    $matomo: {
      trackEvent: sinon.spy()
    }
  }
});

describe('components/generic/NewFeatureNotification', () => {
  describe('hideToast', () => {
    it('hides the toast', async() => {
      const wrapper = factory();
      const bvToastHide = sinon.spy(wrapper.vm.$bvToast, 'hide');

      await wrapper.vm.hideToast();

      expect(bvToastHide.calledWith('new-feature-toast')).toBe(true);
    });
    it('tracks the "dismissed" event', async()  => {
      const wrapper = factory();
      const trackEvent = sinon.spy(wrapper.vm, 'trackEvent');

      await wrapper.vm.hideToast();

      expect(trackEvent.calledWith('dismissed')).toBe(true);
    });
  });
  describe('trackEvent', () => {
    it('tracks a matomo event with the event type and feature name', async() => {
      const wrapper = factory({ feature: 'organisations' });
      const mtmTrackEvent = wrapper.vm.$matomo.trackEvent;

      await wrapper.vm.trackEvent('show');

      expect(mtmTrackEvent.calledWith('New_feature_notification', 'show', 'organisations')).toBe(true);
    });
  });
});
