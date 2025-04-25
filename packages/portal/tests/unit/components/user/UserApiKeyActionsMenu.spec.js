import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import sinon from 'sinon';
import UserApiKeyActionsMenu from '@/components/user/UserApiKeyActionsMenu';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

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

  it('has a dropdown menu', () => {
    const propsData = { apiKey: fixtures.apiKey.personal.enabled };
    const wrapper = factory({ propsData });

    const menu = wrapper.find('[data-qa="user api key actions menu"]');

    expect(menu.exists()).toBe(true);
  });

  describe('when the api key is enabled', () => {
    it('has control button disabled', () => {
      const propsData = { apiKey: fixtures.apiKey.personal.disabled };
      const wrapper = factory({ propsData });

      const button = wrapper.find('[data-qa="user api key actions menu"]');

      expect(button.attributes('disabled')).toBe('true');
    });
  });

  describe('disable personal api key button', () => {
    describe('when the api key is enabled', () => {
      it('is available', () => {
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
