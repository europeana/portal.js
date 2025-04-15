import { createLocalVue, shallowMount } from '@vue/test-utils';
import UserHeader from '@/components/user/UserHeader';

const localVue = createLocalVue();

const accountUrl = 'https://keycloak.example.org/account';

const factory = ({ mocks = {} } = {}) => shallowMount(UserHeader, {
  localVue,
  mocks: {
    $keycloak: { accountUrl: () => accountUrl },
    $store: { state: { auth: { user: {} } } },
    $t: (key) => key,
    ...mocks
  },
  stubs: [
    'b-button',
    'b-col',
    'b-row'
  ]
});

describe('components/user/UserHeader', () => {
  it('shows the logged in username as the h1 text, prefixed with @', () => {
    const mocks = { $store: { state: { auth: { user: { 'preferred_username': 'me' } } } } };
    const wrapper = factory({ mocks });

    const h1 = wrapper.find('h1');

    expect(h1.text()).toBe('@me');
  });

  it('shows an edit profile button linking to keycloak account URL', () => {
    const wrapper = factory();

    const button = wrapper.find('[data-qa="edit profile button"]');

    expect(button.attributes('href')).toBe(accountUrl);
  });

  it('shows a logout button linking to app logout URL', () => {
    const wrapper = factory();

    const button = wrapper.find('[data-qa="logout button"]');

    expect(button.attributes('to')).toBe('/account/logout');
  });
});
