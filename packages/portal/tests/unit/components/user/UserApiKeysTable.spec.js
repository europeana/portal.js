import { createLocalVue, shallowMount } from '@vue/test-utils';
// import sinon from 'sinon';

import UserApiKeysTable from '@/components/user/UserApiKeysTable';

const localVue = createLocalVue();

const defaultProps = {
  apiKeys: [{ 'client_id': 'myKey1', id: 'api-key-id1', state: 'disabled', type: 'PersonalKey' },
    { 'client_id': 'myKey2', id: 'api-key-id2', type: 'PersonalKey' }],
  isDisabled: (apiKey) => apiKey?.state === 'disabled'
};

const factory = ({ propsData = defaultProps, mocks = {} } = {}) => shallowMount(UserApiKeysTable, {
  localVue,
  propsData,
  mocks: {
    $t: (key) => key,
    ...mocks
  },
  stubs: [
    'b-table',
    'UserApiKeysTable'
  ]
});

describe('components/user/UserApiKeysTable', () => {
  it('renders a table', () => {
    const wrapper = factory();

    const table = wrapper.find('b-table-stub');

    expect(table.isVisible()).toBe(true);
  });

  describe('computed', () => {
    describe('sortedApiKeys', () => {
      const apiKeys = [
        { 'client_id': 'myKey1', id: 'api-key-id-1', type: 'PersonalKey', state: 'disabled' },
        { 'client_id': 'myKey2', id: 'api-key-id-2', type: 'PersonalKey', state: 'disabled' },
        { 'client_id': 'myKey3', id: 'api-key-id-3', type: 'PersonalKey' }
      ];

      it('sorts the keys by enabled state first', () => {
        const wrapper = factory({ propsData: {  ...defaultProps, apiKeys } });

        expect(wrapper.vm.sortedApiKeys[0].state).toBe(undefined);
      });
    });
  });
});
