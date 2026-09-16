import { createLocalVue, shallowMount } from '@vue/test-utils';
import FeedbackWidget from '@/components/feedback/FeedbackWidget.vue';

const localVue = createLocalVue();

const factory = () => shallowMount(FeedbackWidget, {
  localVue,
  mocks: {
    $config: { app: { baseUrl: 'https://www.example.eu' } },
    $i18n: { locale: 'en' }
  }
});

describe('components/feedback/FeedbackWidget', () => {
  it('is rendered', () => {
    const wrapper = factory();

    const feedbackWidget = wrapper.find('[data-qa="feedback widget"]');

    expect(feedbackWidget.exists()).toBe(true);
  });
});
