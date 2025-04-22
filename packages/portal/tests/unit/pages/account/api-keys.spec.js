import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../../utils';
import sinon from 'sinon';

import AccountAPIKeysPage from '@/pages/account/api-keys';

const localVue = createLocalVue();

const factory = ({ mocks = {} } = {}) => shallowMountNuxt(AccountAPIKeysPage, {
  localVue,
  mocks: {
    localePath: (path) => path,
    $t: (key) => key,
    ...mocks
  },
  stubs: [
    'b-button',
    'b-form',
    'b-form-checkbox',
    'b-form-group',
    'b-col',
    'b-container',
    'b-row',
    'NuxtLink'
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
    expect(nuxtLink.text()).toBe('🡠 account.title');
  });

  describe('fetch', () => {
    const apiKeys = [{ 'client_id': 'myKey', id: 'api-key-id', type: 'PersonalKey' }];
    const getUserClientsStub = sinon.stub().resolves(apiKeys);
    const mocks = { $apis: { auth: { getUserClients: getUserClientsStub } } };

    it('requests the user clients from the auth service', async() => {
      const wrapper = factory({ mocks });

      await wrapper.vm.$fetch();

      expect(getUserClientsStub.called).toBe(true);
    });

    it('stores the API keys in apiKeys', async() => {
      const wrapper = factory({ mocks });

      await wrapper.vm.$fetch();

      expect(wrapper.vm.apiKeys).toEqual(apiKeys);
    });

    it('displays the API keys', async() => {
      const wrapper = factory({ mocks });

      await wrapper.vm.$fetch();

      expect(wrapper.html()).toContain(apiKeys[0]['client_id']);
    });
  });
});
