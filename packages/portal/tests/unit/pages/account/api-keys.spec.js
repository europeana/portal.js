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
    'b-col',
    'b-container',
    'b-row',
    'b-table',
    'i18n',
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

    it('stores the personal API keys for rendering', async() => {
      const wrapper = factory({ mocks });

      await wrapper.vm.$fetch();

      expect(wrapper.vm.personalKeys).toEqual([{ clientId: 'myKey' }]);
    });

    it('renders a table to display the API keys', async() => {
      const wrapper = factory({ mocks });

      await wrapper.vm.$fetch();
      const table = wrapper.find('b-table-stub');

      expect(table.isVisible()).toBe(true);
    });
  });
});
