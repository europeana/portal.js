import { createLocalVue, shallowMount } from '@vue/test-utils';
import sinon from 'sinon';
import UserApiKeyActionsMenu from '@/components/user/UserApiKeyActionsMenu';

const localVue = createLocalVue();

const deleteClientStub = sinon.spy();

const factory = ({ mocks = {}, propsData = {} } = {}) => shallowMount(UserApiKeyActionsMenu, {
  localVue,
  mocks: {
    $apis: {
      auth: {
        deleteClient: deleteClientStub
      }
    },
    $t: (key) => key,
    ...mocks
  },
  propsData,
  stubs: [
    'b-button',
    'b-list-group-item',
    'b-list-group',
    'ConfirmDangerModal'
  ]
});

const fixtures = {
  apiKey: {
    personal: {
      disabled: { 'client_id': 'myKey', id: 'api-key-id', state: 'disabled', type: 'PersonalKey' },
      enabled: { 'client_id': 'myKey', id: 'api-key-id', type: 'PersonalKey' }
    }
  }
};

describe('components/user/UserApiKeyActionsMenu', () => {
  afterEach(sinon.resetHistory);
  afterAll(sinon.restore);

  it('is collapsed by default', () => {
    const propsData = { apiKey: fixtures.apiKey.personal.enabled };
    const wrapper = factory({ propsData });

    const menu = wrapper.find('[data-qa="user api key actions menu"]');

    expect(menu.exists()).toBe(true);
    expect(menu.isVisible()).toBe(false);
  });

  it('is expanded when control button clicked', async() => {
    const propsData = { apiKey: fixtures.apiKey.personal.enabled };
    const wrapper = factory({ propsData });

    const button = wrapper.find('[data-qa="user api key actions menu control button"]');
    button.vm.$emit('click');
    await wrapper.vm.$nextTick();
    const menu = wrapper.find('[data-qa="user api key actions menu"]');

    expect(menu.isVisible()).toBe(true);
  });

  describe('when the api key is enabled', () => {
    it('has control button disabled', () => {
      const propsData = { apiKey: fixtures.apiKey.personal.disabled };
      const wrapper = factory({ propsData });

      const button = wrapper.find('[data-qa="user api key actions menu control button"]');

      expect(button.attributes('disabled')).toBe('true');
    });
  });

  describe('disable personal api key button', () => {
    describe('when the api key is enabled', () => {
      it('is rendered', () => {
        const propsData = { apiKey: fixtures.apiKey.personal.enabled };
        const wrapper = factory({ propsData });

        const button = wrapper.find('[data-qa="disable personal api key button"]');

        expect(button.exists()).toBe(true);
      });

      describe('when clicked', () => {
        it('first shows the confirmation modal', async() => {
          const propsData = { apiKey: fixtures.apiKey.personal.enabled };
          const wrapper = factory({ propsData });
          expect(wrapper.find('[data-qa="confirm disable api key modal"]').exists()).toBe(false);

          wrapper.find('[data-qa="disable personal api key button"]').vm.$emit('click');
          await wrapper.vm.$nextTick();

          expect(wrapper.find('[data-qa="confirm disable api key modal"]').isVisible()).toBe(true);
        });

        describe('when the confirmation modal emits confirm event', () => {
          it('disables the api key via the auth service', async() => {
            const propsData = { apiKey: fixtures.apiKey.personal.enabled };
            const wrapper = factory({ propsData });

            wrapper.find('[data-qa="disable personal api key button"]').vm.$emit('click');
            await wrapper.vm.$nextTick();
            wrapper.find('[data-qa="confirm disable api key modal"]').vm.$emit('confirm');
            await wrapper.vm.$nextTick();

            expect(deleteClientStub.calledWith(fixtures.apiKey.personal.enabled.id)).toBe(true);
          });

          it('emits the disable event', async() => {
            const propsData = { apiKey: fixtures.apiKey.personal.enabled };
            const wrapper = factory({ propsData });

            wrapper.find('[data-qa="disable personal api key button"]').vm.$emit('click');
            await wrapper.vm.$nextTick();
            wrapper.find('[data-qa="confirm disable api key modal"]').vm.$emit('confirm');
            await wrapper.vm.$nextTick();

            expect(wrapper.emitted('disable')).toEqual([[]]);
          });
        });
      });
    });

    describe('when the api key is disabled', () => {
      it('is not rendered', () => {
        const propsData = { apiKey: fixtures.apiKey.personal.disabled };
        const wrapper = factory({ propsData });

        const button = wrapper.find('[data-qa="disable personal api key button"]');

        expect(button.exists()).toBe(false);
      });
    });
  });
});
