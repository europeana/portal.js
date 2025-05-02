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
});
