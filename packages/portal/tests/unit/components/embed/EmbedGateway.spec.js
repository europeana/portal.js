import { createLocalVue, shallowMount } from '@vue/test-utils';

import EmbedGateway from '@/components/embed/EmbedGateway';

const localVue = createLocalVue();

const factory = () => shallowMount(EmbedGateway, {
  localVue,
  mocks: {
    $t: (key) => key
    // $i18n: {
    //   locale: 'en'
    // }
  }
});

describe('components/embed/EmbedGateway', () => {
  describe('when not opened', () => {
    it('renders a notification overlay', () => {
      const wrapper = factory();

      const notification =  wrapper.find('.notification-overlay');

      expect(notification.exists()).toBe(true);
    });
  });
});
