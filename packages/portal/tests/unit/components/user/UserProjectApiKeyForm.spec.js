import { shallowMount } from '@vue/test-utils';

import UserProjectApiKeyForm from '@/components/user/UserProjectApiKeyForm.vue';

const factory = (user = {}) => shallowMount(UserProjectApiKeyForm, {
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
            ...user
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
    describe('when user names are present in the user data', () => {
      it('interpolates the configured form URL, language and current user info', async() => {
        const wrapper = factory({ 'given_name': 'John', 'family_name': 'Doe', email: 'john.doe@example.org' });
        expect(wrapper.vm.embed.includes('https://example.org/formEmbed/en?first_name=John&last_name=Doe&email=john.doe%40example.org')).toBe(true);
      });
    });

    describe('when no names are present in the user data', () => {
      it('interpolates the configured form URL, language and email', async() => {
        const wrapper = factory({ email: 'john.doe@example.org' });
        expect(wrapper.vm.embed.includes('https://example.org/formEmbed/en?first_name=&last_name=&email=john.doe%40example.org')).toBe(true);
      });
    });
  });
});
