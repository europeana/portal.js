import { createLocalVue, shallowMount } from '@vue/test-utils';
import FeedbackWidget from '@/components/feedback/FeedbackWidget.vue';

const localVue = createLocalVue();

const factory = ({ mocks = {} } = {}) => shallowMount(FeedbackWidget, {
  localVue,
  mocks: {
    $config: { app: { baseUrl: 'https://www.example.eu' } },
    $features: {},
    $i18n: { locale: 'en' },
    ...mocks
  }
});

describe('components/feedback/FeedbackWidget', () => {
  describe('when feedback toggle disabled', () => {
    it('is not loaded', () => {
      const wrapper = factory();

      const feedbackWidget = wrapper.find('[data-qa="feedback widget"]');

      expect(feedbackWidget.exists()).toBe(false);
    });
  });

  describe('when feedback toggle enabled', () => {
    it('is rendered', () => {
      const wrapper = factory({ mocks: { $features: { jiraServiceDeskFeedbackForm: true } } });

      const feedbackWidget = wrapper.find('[data-qa="feedback widget"]');

      expect(feedbackWidget.exists()).toBe(true);
    });
  });
});
