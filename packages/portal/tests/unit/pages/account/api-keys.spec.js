import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../../utils';
import sinon from 'sinon';

import AccountAPIKeysPage from '@/pages/account/api-keys';

const localVue = createLocalVue();

const fixtures = {
  apiKey: {
    personal: {
      disabled: { 'client_id': 'myKey', id: 'api-key-id', state: 'disabled', type: 'PersonalKey' },
      enabled: { 'client_id': 'myKey', id: 'api-key-id', type: 'PersonalKey' }
    }
  }
};

const factory = ({ data = {}, mocks = {} } = {}) => shallowMountNuxt(AccountAPIKeysPage, {
  data() {
    return {
      ...data
    };
  },
  localVue,
  mocks: {
    localePath: (path) => path,
    $t: (key) => key,
    ...mocks
  },
  stubs: [
    'b-button',
    'b-col',
    'b-container',
    'b-form-checkbox',
    'b-form-group',
    'b-form',
    'b-row',
    'i18n',
    'NuxtLink',
    'UserApiKeysTable'
  ]
});

describe('pages/account/api-keys', () => {
  afterEach(sinon.resetHistory);
  afterAll(sinon.restore);

  it('shows the user header', () => {
    const wrapper = factory();

    const userHeader = wrapper.find('UserHeader-stub');

    expect(userHeader.isVisible()).toBe(true);
  });

  it('has a link back to the account page', () => {
    const wrapper = factory();

    const nuxtLink = wrapper.find('NuxtLink-stub');

    expect(nuxtLink.attributes('to')).toBe('/account');
    expect(nuxtLink.text()).toBe('account.title');
  });

  describe('fetch', () => {
    const apiKeys = [
      fixtures.apiKey.personal.disabled,
      fixtures.apiKey.personal.enabled
    ];
    const getUserClientsStub = sinon.stub().resolves(apiKeys);
    const mocks = { $apis: { auth: { getUserClients: getUserClientsStub } } };

    it('requests the user clients from the auth service', async() => {
      const wrapper = factory({ mocks });

      await wrapper.vm.$fetch();

      expect(getUserClientsStub.called).toBe(true);
    });

    it('stores the personal API keys for rendering', async() => {
      const wrapper = factory({ mocks });

      await wrapper.vm.$fetch();

      expect(wrapper.vm.personalKeys).toEqual(apiKeys);
    });

    it('renders a table to display the API keys', async() => {
      const wrapper = factory({ mocks });

      await wrapper.vm.$fetch();
      const table = wrapper.find('userapikeystable-stub');

      expect(table.isVisible()).toBe(true);
    });
  });

  describe('request personal api key form', () => {
    describe('when an active personal API key exists', () => {
      const apiKeys = [{ 'client_id': 'myKey', id: 'api-key-id', type: 'PersonalKey' }];
      it('is not displayed if an', () => {
        const data = { personalKeys: apiKeys };
        const wrapper = factory({ data });

        const form = wrapper.find('[data-qa="request personal api key form"]');

        expect(form.exists()).toBe(false);
      });
    });

    describe('when no active personal API key exists', () => {
      const apiKeys = [{ 'client_id': 'myKey', id: 'api-key-id', type: 'PersonalKey', state: 'disabled' }];
      it('is displayed', () => {
        const data = { personalKeys: apiKeys };
        const wrapper = factory({ data });

        const form = wrapper.find('[data-qa="request personal api key form"]');

        expect(form.isVisible()).toBe(true);
      });

      it('disables the submit button if terms of use are not confirmed', () => {
        const data = { confirmPersonalKeyTermsOfUse: false, personalKeys: apiKeys };
        const wrapper = factory({ data });

        const button = wrapper.find('[data-qa="request personal api key form"] b-button-stub');

        expect(button.attributes('disabled')).toBe('true');
      });

      it('enables the submit button if terms of use are confirmed', () => {
        const data = { confirmPersonalKeyTermsOfUse: true, personalKeys: apiKeys };
        const wrapper = factory({ data });

        const button = wrapper.find('[data-qa="request personal api key form"] b-button-stub');

        expect(button.attributes('disabled')).toBeUndefined();
      });
    });
  });
});
