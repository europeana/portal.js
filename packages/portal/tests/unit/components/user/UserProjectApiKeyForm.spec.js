import { shallowMount } from '@vue/test-utils';

import UserProjectApiKeyForm from '@/components/user/UserProjectApiKeyForm.vue';

const factory = () => shallowMount(UserProjectApiKeyForm, {
  mocks: {
    $config: {
      app: {
        projectApiKeyFormUrl: 'https://example.org/formEmbed'
      }
    },
    $store: {
      state: {
        auth: {
          user: {
            'given_name': 'John',
            'family_name': 'Doe',
            email: 'john.doe@example.org'
          }
        }
      }
    },
    $i18n: {
      locale: 'en'
    }
  }
});

describe('components/user/UserProjectApiKeyForm', () => {
  describe('data embed', () => {
    it('interpolates the configured form URL, language and current user info', async() => {
      const wrapper = factory();
      console.log(wrapper.vm.embed);
      expect(wrapper.vm.embed.includes('https://example.org/formEmbed/en?first_name=John&last_name=Doe&email=john.doe@example.org')).toBe(true);
    });
  });
});
