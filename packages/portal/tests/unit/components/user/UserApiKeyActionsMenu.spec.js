import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import sinon from 'sinon';
import UserApiKeyActionsMenu from '@/components/user/UserApiKeyActionsMenu';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const deleteClientStub = sinon.stub();
const errorPluginSpy = sinon.spy();

const factory = ({ mocks = {}, propsData = {} } = {}) => shallowMount(UserApiKeyActionsMenu, {
  localVue,
  mocks: {
    $apis: {
      auth: {
        deleteClient: deleteClientStub
      }
    },
    $error: errorPluginSpy,
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

  describe('when the api key is disabled', () => {
    describe('re-enable personal api key button', () => {
      it('is available', () => {
        const propsData = { apiKey: fixtures.apiKey.personal.disabled };
        const wrapper = factory({ propsData });

        const button = wrapper.find('[data-qa="re-enable personal api key button"]');

        expect(button.exists()).toBe(true);
      });

      describe('when clicked', () => {
        it('shows the info modal', async() => {
          const propsData = { apiKey: fixtures.apiKey.personal.disabled };
          const wrapper = factory({ propsData });

          wrapper.find('[data-qa="re-enable personal api key button"]').vm.$emit('click');
          await wrapper.vm.$nextTick();

          expect(wrapper.find('[data-qa="re-enable api key info modal"]').isVisible()).toBe(true);
        });
      });
    });
  });

  describe('when the api key is enabled', () => {
    describe('disable personal api key button', () => {
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

          describe('when the auth service errors', () => {
            const error = new Error;
            const $apis = {
              auth: {
                deleteClient: sinon.stub().rejects(error)
              }
            };

            it('handles the error via error plugin', async() => {
              const mocks = { $apis };
              const propsData = { apiKey: fixtures.apiKey.personal.enabled };
              const wrapper = factory({ mocks, propsData });

              wrapper.find('[data-qa="disable personal api key button"]').vm.$emit('click');
              await wrapper.vm.$nextTick();
              wrapper.find('[data-qa="confirm disable api key modal"]').vm.$emit('confirm');
              await wrapper.vm.$nextTick();

              expect(errorPluginSpy.calledWith(error)).toBe(true);
            });

            describe('when the error is due to the key already being disabled', () => {
              const error = new Error;
              error.code = 'authClientDisabled';
              const $apis = {
                auth: {
                  deleteClient: sinon.stub().rejects(error)
                }
              };

              it('emits the disable event', async() => {
                const mocks = { $apis };
                const propsData = { apiKey: fixtures.apiKey.personal.enabled };
                const wrapper = factory({ mocks, propsData });

                wrapper.find('[data-qa="disable personal api key button"]').vm.$emit('click');
                await wrapper.vm.$nextTick();
                wrapper.find('[data-qa="confirm disable api key modal"]').vm.$emit('confirm');
                await wrapper.vm.$nextTick();

                expect(wrapper.emitted('disable')).toEqual([[]]);
              });
            });

            describe('when the error is not due to the key already being disabled', () => {
              const error = new Error;
              error.code = 'unknownError';
              const $apis = {
                auth: {
                  deleteClient: sinon.stub().rejects(error)
                }
              };

              it('does not emit the disable event', async() => {
                const mocks = { $apis };
                const propsData = { apiKey: fixtures.apiKey.personal.enabled };
                const wrapper = factory({ mocks, propsData });

                wrapper.find('[data-qa="disable personal api key button"]').vm.$emit('click');
                await wrapper.vm.$nextTick();
                wrapper.find('[data-qa="confirm disable api key modal"]').vm.$emit('confirm');
                await wrapper.vm.$nextTick();

                expect(wrapper.emitted('disable')).toBeUndefined();
              });
            });
          });
        });
      });
    });
  });
});
