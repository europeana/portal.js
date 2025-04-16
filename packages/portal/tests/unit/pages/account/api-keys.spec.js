import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../../utils';
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
    'NuxtLink'
  ]
});

describe('pages/account/api-keys', () => {
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
});
