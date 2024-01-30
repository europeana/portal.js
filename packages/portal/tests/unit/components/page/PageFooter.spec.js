import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';

import SmartLink from '@/components/generic/SmartLink.vue';
import PageFooter from '@/components/page/PageFooter.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);
localVue.component('SmartLink', SmartLink);

const factory = ({ mocks = {} } = {}) => shallowMount(PageFooter, {
  localVue,
  mocks: {
    $config: { app: { baseUrl: 'https://www.example.eu' } },
    $features: {},
    $i18n: {
      locale: 'en'
    },
    $store: {
      getters: {
        'debug/settings': { enabled: false }
      }
    },
    $t: (key) => key,
    ...mocks
  },
  stubs: {
    FeedbackWidget: true
  }
});

describe('components/PageFooter', () => {
  it('contains the language selector', async() => {
    const wrapper = factory();
    await wrapper.setProps({
      enableLanguageSelector: true
    });
    const selector = wrapper.find('[data-qa="language selector"]');

    expect(selector.isVisible()).toBe(true);
  });

  it('retrieves the correct navigation data', () => {
    const wrapper = factory();
    const links = wrapper.vm.footerMoreInfo.links;

    expect(links.some(link => link.text === 'footer.navigation.about')).toBe(true);
  });

  describe('debug link group', () => {
    it('is not shown by default', () => {
      const wrapper = factory();

      expect(wrapper.vm.showDebugLinkGroup).toBe(false);
    });

    it('is shown if enabled in stored debug settings', () => {
      const wrapper = factory();

      wrapper.vm.$store.getters['debug/settings'] = { enabled: true };

      expect(wrapper.vm.showDebugLinkGroup).toBe(true);
    });
  });

  describe('FeedbackWidget', () => {
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
});
