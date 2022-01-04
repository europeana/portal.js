import { createLocalVue, shallowMount } from '@vue/test-utils';
import Vuex from 'vuex';

import SocialShare from '@/components/sharing/SocialShare.vue';

const localVue = createLocalVue();
localVue.use(Vuex);

const store = new Vuex.Store({
  getters: {
    'http/canonicalUrl': () => 'https://www.example.org/page'
  }
});

const factory = () => shallowMount(SocialShare, {
  localVue,
  store,
  stubs: ['b-link'],
  propsData: {
    mediaUrl: '/img/portrait.jpg'
  },
  mocks: {
    $t: () => {}
  }
});

describe('components/sharing/SocialShare', () => {
  describe('when there are social share buttons', () => {
    it('one button has a facebook share url', () => {
      const wrapper = factory();
      const facebook = wrapper.find('[data-qa="share facebook button"]');

      expect(facebook.attributes().href.startsWith('https://www.facebook.com/sharer/sharer.php'));
      expect(facebook.attributes().href).toContain('https://www.example.org/page');
    });

    it('one button has a twitter share url', () => {
      const wrapper = factory();
      const twitter = wrapper.find('[data-qa="share twitter button"]');

      expect(twitter.attributes().href.startsWith('https://twitter.com/intent/tweet'));
      expect(twitter.attributes().href).toContain('https://www.example.org/page');
    });

    it('one button has a pinterest share url', () => {
      const wrapper = factory();
      const pinterest = wrapper.find('[data-qa="share pinterest button"]');

      expect(pinterest.attributes().href.startsWith('https://pinterest.com/pin/create/link'));
      expect(pinterest.attributes().href).toContain('https://www.example.org/page');
      expect(pinterest.attributes().href).toContain('/img/portrait.jpg');
    });
  });
});
