import { createLocalVue, shallowMount } from '@vue/test-utils';
// import sinon from 'sinon';

import UserApiKeysTable from '@/components/user/UserApiKeysTable';

const localVue = createLocalVue();

const defaultProps = {
  apiKeys: [{ 'client_id': 'myKey1', id: 'api-key-id1', type: 'PersonalKey' },
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

  describe('tableFields', () => {
    describe('when type is project', () => {
      it('has a field for name', () => {
        const wrapper = factory({ propsData: {  ...defaultProps, type: 'project' } });

        const hasNameTableField = Boolean(wrapper.vm.tableFields.filter(field => field.key === 'name').length);

        expect(hasNameTableField).toBe(true);
      });
    });
  });

  describe('computed', () => {
    describe('sortedApiKeys', () => {
      const apiKeys = [
        { 'client_id': 'myKey1', id: 'api-key-id-1', type: 'ProjectKey', state: 'disabled' },
        { 'client_id': 'myKey2', id: 'api-key-id-2', type: 'ProjectKey', state: 'disabled' },
        { 'client_id': 'myKey3', id: 'api-key-id-3', type: 'ProjectKey' }
      ];

      it('sorts the keys by enabled state first', () => {
        const wrapper = factory({ propsData: {  ...defaultProps, apiKeys } });

        expect(wrapper.vm.sortedApiKeys[0].state).toBe(undefined);
      });
    });

    describe('apiKeysWithDetails', () => {
      describe('when type is project', () => {
        it('adds the _showDetails prop to each row', () => {
          const wrapper = factory({ propsData: {  ...defaultProps, type: 'project' } });

          expect(wrapper.vm.apiKeysWithDetails.every(key => key['_showDetails'])).toBe(true);
        });
      });
    });
  });

  describe('methods', () => {
    describe('handleDisableApiKey', () => {
      it('emits keyDisabled', () => {
        const wrapper = factory();

        wrapper.vm.handleDisableApiKey();

        expect(wrapper.emitted('keyDisabled').length).toBe(1);
      });
    });

    describe('tableRowClass', () => {
      describe('when type is row and key is disabled', () => {
        it('returns \'disabled\'', () => {
          const wrapper = factory();

          expect(wrapper.vm.tableRowClass({ state: 'disabled' }, 'row')).toEqual('disabled');
        });
      });
      describe('when type is row and key is not disabled', () => {
        it('returns \'disabled\'', () => {
          const wrapper = factory();

          expect(wrapper.vm.tableRowClass({}, 'row')).toEqual(undefined);
        });
      });
    });

    describe('sortByEnabled', () => {
      it('returns the position of a key based on disabled state', () => {
        const wrapper = factory();

        expect(wrapper.vm.sortByEnabled({ state: 'disabled' }, { state: 'disabled' })).toEqual(0);
        expect(wrapper.vm.sortByEnabled({}, {})).toEqual(0);
        expect(wrapper.vm.sortByEnabled({ state: 'disabled' }, {})).toEqual(1);
        expect(wrapper.vm.sortByEnabled({}, { state: 'disabled' })).toEqual(-1);
      });
    });
  });
});
