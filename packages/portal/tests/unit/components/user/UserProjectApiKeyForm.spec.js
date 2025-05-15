import { shallowMount } from '@vue/test-utils';

import UserProjectApiKeyForm from '@/components/user/UserProjectApiKeyForm.vue';

const factory = () => shallowMount(UserProjectApiKeyForm, {
  mocks: {
    $config: {
      app: {
        projectApiKeyFormUrl: 'https://example.org/formEmbed'
      }
    }
  }
});

describe('components/user/UserProjectApiKeyForm', () => {
  describe('data embed', () => {
    it('interpolates the configured form URL', async() => {
      const wrapper = factory();

      expect(wrapper.vm.embed.includes('https://example.org/formEmbed')).toBe(true);
    });
  });
});
