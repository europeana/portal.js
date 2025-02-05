import { createLocalVue, shallowMount } from '@vue/test-utils';
import sinon from 'sinon';
import BootstrapVue from 'bootstrap-vue';

import ShareSocialButtons from '@/components/share/ShareSocialButtons.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = () => shallowMount(ShareSocialButtons, {
  localVue,
  attachTo: document.body,
  stubs: ['b-button'],
  propsData: {
    mediaUrl: '/img/portrait.jpg'
  },
  mocks: {
    $config: {
      app: {
        baseUrl: 'https://www.example.org'
      }
    },
    $i18n: {
      locale: 'fr'
    },
    $route: {
      fullPath: '/page',
      path: '/page'
    },
    $matomo: {
      trackEvent: sinon.spy()
    },
    $t: () => {}
  }
});

describe('components/share/ShareSocialButtons', () => {
  describe('when there are social share buttons', () => {
    it('one button has a facebook share url', () => {
      const wrapper = factory();
      const facebook = wrapper.find('[data-qa="share facebook button"]');

      expect(facebook.attributes().href.startsWith('https://www.facebook.com/sharer/sharer.php')).toBe(true);
      expect(facebook.attributes().href).toContain('https://www.example.org/page');
    });

    it('one button has a x share url', () => {
      const wrapper = factory();
      const x = wrapper.find('[data-qa="share x button"]');

      expect(x.attributes().href.startsWith('https://twitter.com/intent/tweet')).toBe(true);
      expect(x.attributes().href).toContain('https://www.example.org/page');
    });

    it('one button has a pinterest share url', () => {
      const wrapper = factory();
      const pinterest = wrapper.find('[data-qa="share pinterest button"]');

      expect(pinterest.attributes().href.startsWith('https://pinterest.com/pin/create/link')).toBe(true);
      expect(pinterest.attributes().href).toContain('https://www.example.org/page');
      expect(pinterest.attributes().href).toContain('/img/portrait.jpg');
    });
  });

  describe('when a share button is clicked', () => {
    it('tracks the share even to matomo', async() => {
      const wrapper = factory();
      const mockUrl = 'https://example.facebook.eu';

      wrapper.vm.trackShare({ url: mockUrl });

      expect(wrapper.vm.$matomo.trackEvent.calledWith('Item_share', 'Click social share button', mockUrl)).toBe(true);
    });
  });
});
