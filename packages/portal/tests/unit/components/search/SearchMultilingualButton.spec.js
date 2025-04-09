import { createLocalVue, shallowMount } from '@vue/test-utils';
import SearchMultilingualButton from '@/components/search/SearchMultilingualButton';
import BootstrapVue from 'bootstrap-vue';
import sinon from 'sinon';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = ({ mocks = {} } = {}) => shallowMount(SearchMultilingualButton, {
  localVue,
  mocks: {
    $auth: { loggedIn: false },
    $config: { app: { baseUrl: 'https://www.example.eu' } },
    $route: {
      fullPath: '/search',
      query: {}
    },
    $router: {
      push: sinon.spy(),
      replace: sinon.spy()
    },
    $t: (key) => key,
    localePath: (args) => args,
    ...mocks
  }
});

describe('components/search/SearchMultilingualButton', () => {
  it('renders a button in non-selected state', () => {
    const wrapper = factory();

    const button = wrapper.find('.search-multilingual-button');

    expect(button.attributes('aria-label')).toBe('search.multilingual.enable');
  });

  describe('when user is logged in and the multilingual query is in the route', () => {
    it('renders a button in selected state', () => {
      const wrapper = factory({ mocks: { $auth: { loggedIn: true }, $route: { query: { multilingual: true } } } });

      const button = wrapper.find('.search-multilingual-button');

      expect(button.attributes('aria-label')).toBe('search.multilingual.disable');
    });

    it('emits the toggleMultilingual event and removes the multilingual param from the URL', () => {
      const searchQuery = { query: 'painting' };
      const wrapper = factory({ mocks: { $auth: { loggedIn: true }, $route: { query: { searchQuery, multilingual: true } } } });

      expect(wrapper.emitted('toggleMultilingual').length).toBe(1);
      expect(wrapper.vm.$router.replace.calledWith({ query: { searchQuery, multilingual: undefined } })).toBe(true);
    });
  });

  describe('when clicked', () => {
    describe('and user is not logged in', () => {
      it('redirects to login with a redirect back including a multilingual paramater', () => {
        const fullPath = '/es/search?query=painting';
        const redirect = `${fullPath}&multilingual=true`;
        const wrapper = factory({ mocks: { $route: { fullPath  } } });

        const button = wrapper.find('.search-multilingual-button');
        button.trigger('click');

        expect(wrapper.vm.$router.push.calledWith({
          name: 'account-login',
          query: { redirect }
        })).toBe(true);
      });
    });

    describe('and user is logged in', () => {
      it('toggles the selected state and emits the toggleMultilingual event', async() => {
        const wrapper = factory({ mocks: { $auth: { loggedIn: true } } });

        const button = wrapper.find('.search-multilingual-button');
        button.trigger('click');
        await wrapper.vm.$nextTick();

        expect(button.attributes('aria-label')).toBe('search.multilingual.disable');
        expect(wrapper.emitted('toggleMultilingual').length).toBe(1);
      });
    });
  });
});
