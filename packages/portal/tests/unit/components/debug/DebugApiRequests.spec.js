import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../../utils';
import BootstrapVue from 'bootstrap-vue';
import sinon from 'sinon';
import DebugApiRequests from '@/components/debug/DebugApiRequests.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = ({ mocks = {}, settings = {}, requests = [] } = {}) => shallowMountNuxt(DebugApiRequests, {
  localVue,
  mocks: {
    $nuxt: {
      context: {
        app: {
          router: {
            push: sinon.spy()
          }
        }
      }
    },
    $route: {},
    $t: () => '',
    $store: {
      state: {
        axiosLogger: {
          requests
        }
      },
      getters: {
        'debug/settings': settings || {}
      },
      commit: sinon.spy()
    },
    ...mocks
  },
  stubs: ['i18n']
});

describe('components/debug/DebugApiRequests', () => {
  beforeEach(sinon.resetHistory);

  describe('fetch', () => {
    describe('when logged in', () => {
      const $auth = { loggedIn: true };

      describe('and manage API keys feature is enabled', () => {
        const $features = { manageApiKeys: true };

        it('fetches user API keys from auth service', async() => {
          const $apis = {
            auth: {
              getUserClients: sinon.stub().resolves([])
            }
          };
          const wrapper = factory({ mocks: { $apis, $auth, $features } });

          await wrapper.vm.fetch();

          expect($apis.auth.getUserClients.calledWith()).toBe(true);
        });

        it('stores active personal API key', async() => {
          const keys = [
            { 'client_id': 'enabled-project-key', type: 'ProjectKey' },
            { 'client_id': 'disabled-personal-key', state: 'disabled', type: 'PersonalKey' },
            { 'client_id': 'enabled-personal-key', type: 'PersonalKey' }
          ];
          const $apis = {
            auth: {
              getUserClients: sinon.stub().resolves(keys)
            }
          };
          const wrapper = factory({ mocks: { $apis, $auth, $features } });

          await wrapper.vm.fetch();

          expect(wrapper.vm.userApiKey).toEqual({ 'client_id': 'enabled-personal-key', type: 'PersonalKey' });
        });
      });

      describe('and manage API keys feature is disabled', () => {
        const $features = { manageApiKeys: false };

        it('does not fetch user API keys from auth service', async() => {
          const $apis = {
            auth: {
              getUserClients: sinon.stub().resolves([])
            }
          };
          const wrapper = factory({ mocks: { $apis, $auth, $features } });

          await wrapper.vm.fetch();

          expect($apis.auth.getUserClients.called).toBe(false);
        });
      });
    });

    describe('when not logged in', () => {
      const $auth = { loggedIn: false };

      describe('and manage API keys feature is enabled', () => {
        const $features = { manageApiKeys: true };

        it('fetches user API keys from auth service', async() => {
          const $apis = {
            auth: {
              getUserClients: sinon.stub().resolves([])
            }
          };
          const wrapper = factory({ mocks: { $apis, $auth, $features } });

          await wrapper.vm.fetch();

          expect($apis.auth.getUserClients.calledWith()).toBe(false);
        });
      });

      describe('and manage API keys feature is disabled', () => {
        const $features = { manageApiKeys: false };

        it('does not fetch user API keys from auth service', async() => {
          const $apis = {
            auth: {
              getUserClients: sinon.stub().resolves([])
            }
          };
          const wrapper = factory({ mocks: { $apis, $auth, $features } });

          await wrapper.vm.fetch();

          expect($apis.auth.getUserClients.called).toBe(false);
        });
      });
    });
  });

  describe('template', () => {
    it('lists requests', () => {
      const requests = [
        { method: 'GET', url: 'https://api.example.org/request/1' },
        { method: 'POST', url: 'https://api.example.org/request/2' }
      ];

      const wrapper = factory({ requests });

      const apiRequests = wrapper.findAll('[data-qa="logged API request"]');

      expect(apiRequests.length).toBe(2);
    });

    it('displays the HTTP request method', () => {
      const requests = [
        { method: 'GET', url: 'https://api.example.org/request/1' },
        { method: 'POST', url: 'https://api.example.org/request/2' }
      ];
      const wrapper = factory({ requests });

      const apiRequests = wrapper.findAll('[data-qa="logged API request"]');

      expect(apiRequests.at(0).text()).toContain('GET');
      expect(apiRequests.at(1).text()).toContain('POST');
    });

    describe('when HTTP request method is GET', () => {
      it('links to the request URL', () => {
        const requests = [
          { method: 'GET', url: 'https://api.example.org/request/1' }
        ];

        const wrapper = factory({ requests });

        const apiRequestLink = wrapper.find('[data-qa="logged API request"] a');

        expect(apiRequestLink.text()).toBe('https://api.example.org/request/1');
        expect(apiRequestLink.attributes('href')).toBe('https://api.example.org/request/1');
      });
    });

    describe('when HTTP request method is not GET', () => {
      it('just displays the URL', () => {
        const requests = [
          { method: 'POST', url: 'https://api.example.org/request/1' }
        ];

        const wrapper = factory({ requests });

        const apiRequest = wrapper.find('[data-qa="logged API request"]');

        expect(apiRequest.text()).toContain('https://api.example.org/request/1');
        expect(apiRequest.find('a').exists()).toBeFalsy();
      });
    });
  });

  describe('computed', () => {
    describe('requests', () => {
      it('reads requests from axiosLogger store', () => {
        const requests = [
          { method: 'GET', url: 'https://api.example.org/request/1' }
        ];

        const wrapper = factory({ requests });

        expect(wrapper.vm.requests).toBe(requests);
      });

      it('is null if there is no axiosLogger store state', () => {
        const wrapper = factory();
        wrapper.vm.$store.state.axiosLogger = undefined;

        expect(wrapper.vm.requests).toBe(null);
      });
    });

    describe('when API key is set in debug settings', () => {
      it('uses it to override the wskey query param in requests having it', () => {
        const requests = [
          { method: 'GET', url: 'https://api.example.org/request/1?wskey=SECRET' },
          { method: 'GET', url: 'https://api.example.org/request/2?query=*' }
        ];

        const wrapper = factory({ requests });
        wrapper.vm.$store.getters['debug/settings'] = { apiKey: 'OVERRIDE' };

        expect(wrapper.vm.requests).toEqual([
          { method: 'GET', url: 'https://api.example.org/request/1?wskey=OVERRIDE' },
          { method: 'GET', url: 'https://api.example.org/request/2?query=*' }
        ]);
      });
    });
  });

  describe('watch', () => {
    describe('$route', () => {
      it('shows the modal when the to route hash is right', async() => {
        const wrapper = factory();
        sinon.spy(wrapper.vm, 'showModal');

        await wrapper.vm.watch.$route.call(wrapper.vm, { hash: wrapper.vm.hash });

        expect(wrapper.vm.showModal.called).toBe(true);
      });

      it('hides the modal when the from route hash is right', async() => {
        const wrapper = factory();
        sinon.spy(wrapper.vm, 'hideModal');

        await wrapper.vm.watch.$route.call(wrapper.vm, {}, { hash: wrapper.vm.hash });

        expect(wrapper.vm.hideModal.called).toBe(true);
      });
    });
  });

  describe('mounted', () => {
    it('shows the modal when the hash is right', () => {
      const wrapper = factory();
      sinon.spy(wrapper.vm, 'showModal');
      wrapper.vm.$route = { hash: wrapper.vm.hash };

      wrapper.vm.mounted();

      expect(wrapper.vm.showModal.called).toBe(true);
    });

    it('does not show the modal when the hash is wrong', () => {
      const wrapper = factory();
      sinon.spy(wrapper.vm, 'showModal');
      wrapper.vm.$route = { hash: '#main' };

      wrapper.vm.mounted();

      expect(wrapper.vm.showModal.called).toBe(false);
    });
  });

  describe('methods', () => {
    describe('showModal', () => {
      it('shows the modal', () => {
        const wrapper = factory();
        sinon.spy(wrapper.vm.$bvModal, 'show');

        wrapper.vm.showModal();

        expect(wrapper.vm.$bvModal.show.calledWith('api-requests')).toBe(true);
      });
    });

    describe('hideModal', () => {
      it('removes the hash from the route', () => {
        const wrapper = factory();
        wrapper.vm.$route = { path: '/search', hash: '#api-requests' };

        wrapper.vm.hideModal();

        expect(wrapper.vm.$nuxt.context.app.router.push.calledWith({ path: '/search', hash: undefined })).toBe(true);
      });

      it('hdies the modal', () => {
        const wrapper = factory();
        sinon.spy(wrapper.vm.$bvModal, 'hide');

        wrapper.vm.hideModal();

        expect(wrapper.vm.$bvModal.hide.calledWith('api-requests')).toBe(true);
      });

      describe('saveApiKey', () => {
        const settings = { apiKey: 'SECRET' };

        it('commits settings to the store', () => {
          const wrapper = factory({ settings });

          wrapper.vm.saveApiKey();

          expect(wrapper.vm.$store.commit.calledWith('debug/updateSettings', settings)).toBe(true);
        });
      });
    });
  });
});
