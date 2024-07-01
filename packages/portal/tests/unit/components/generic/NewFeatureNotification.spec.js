import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import NewFeatureNotification from '@/components/generic/NewFeatureNotification.vue';
import sinon from 'sinon';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const basePropsData = { name: 'new' };

const factory = (propsData = basePropsData) => shallowMount(NewFeatureNotification, {
  localVue,
  propsData,
  mocks: {
    $t: () => {},
    $cookies: {
      get: () => null,
      set: () => {}
    },
    $matomo: {
      trackEvent: sinon.spy()
    }
  }
});

describe('components/generic/NewFeatureNotification', () => {
  afterEach(sinon.resetHistory);

  it('tracks the showing of the component in matomo', () => {
    const wrapper = factory();
    const mtmTrackEvent = wrapper.vm.$matomo.trackEvent;

    expect(mtmTrackEvent.calledWith('New_feature_notification', 'show', 'new')).toBe(true);
  });

  it('shows a "dismiss" button', () => {
    const wrapper = factory();

    const dismissButton = wrapper.find('[data-qa="new feature dismiss"]');

    expect(dismissButton.exists()).toBe(true);
  });

  describe('when the "dismiss button is clicked', () => {
    it('tracks the event in matomo', () => {
      const wrapper = factory();
      const mtmTrackEvent = wrapper.vm.$matomo.trackEvent;

      const dismissButton = wrapper.find('[data-qa="new feature dismiss"]');
      dismissButton.trigger('click');

      expect(mtmTrackEvent.calledWith('New_feature_notification', 'dismissed', 'new')).toBe(true);
    });

    it('hides the toast', () => {
      const wrapper = factory();
      const bvToastHide = sinon.spy(wrapper.vm.$bvToast, 'hide');

      const dismissButton = wrapper.find('[data-qa="new feature dismiss"]');
      dismissButton.trigger('click');

      expect(bvToastHide.calledWith('new-feature-toast')).toBe(true);
    });
  });

  describe('when a url prop is passed', () => {
    const propsData = { name: 'new', url: 'https://www.example.eu' };

    it('shows a "read more" button', () => {
      const wrapper = factory(propsData);

      const readMoreButton = wrapper.find('[data-qa="new feature read more"]');

      expect(readMoreButton.exists()).toBe(true);
    });

    describe('when the "read more" button is clicked', () => {
      it('tracks the event in matomo', () => {
        const wrapper = factory(propsData);
        const mtmTrackEvent = wrapper.vm.$matomo.trackEvent;

        const readMoreButton = wrapper.find('[data-qa="new feature read more"]');
        readMoreButton.trigger('click');

        expect(mtmTrackEvent.calledWith('New_feature_notification', 'click read more', 'new')).toBe(true);
      });

      it('hides the toast', () => {
        const wrapper = factory(propsData);
        const bvToastHide = sinon.spy(wrapper.vm.$bvToast, 'hide');

        const readMoreButton = wrapper.find('[data-qa="new feature read more"]');
        readMoreButton.trigger('click');

        expect(bvToastHide.calledWith('new-feature-toast')).toBe(true);
      });
    });
  });
});
