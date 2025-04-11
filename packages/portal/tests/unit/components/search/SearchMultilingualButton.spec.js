import { createLocalVue, shallowMount } from '@vue/test-utils';
import SearchMultilingualButton from '@/components/search/SearchMultilingualButton';
import BootstrapVue from 'bootstrap-vue';
import sinon from 'sinon';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = ({ mocks = {}, data = {} } = {}) => shallowMount(SearchMultilingualButton, {
  localVue,
  mocks: {
    $auth: { loggedIn: false },
    $keycloak: {
      login: sinon.spy()
    },
    $t: (key) => key,
    $matomo: {
      trackEvent: sinon.stub()
    },
    $i18n: {
      locales: [
        {
          code: 'en',
          name: 'English'
        },
        {
          code: 'es',
          name: 'Español'
        }
      ],
      locale: 'es'
    },
    ...mocks
  },
  data: () => ({ ...data })
});

describe('components/search/SearchMultilingualButton', () => {
  beforeEach(() => {
    sinon.resetHistory();
  });
  it('renders a button in non-selected state', () => {
    const wrapper = factory();

    const button = wrapper.find('.search-multilingual-button');

    expect(button.attributes('aria-label')).toBe('search.multilingual.enable');
  });

  describe('when clicked', () => {
    describe('and user is not logged in', () => {
      it('redirects to login', () => {
        const wrapper = factory();

        const button = wrapper.find('.search-multilingual-button');
        button.trigger('click');

        expect(wrapper.vm.$keycloak.login.called).toBe(true);
      });
    });

    describe('and user is logged in', () => {
      describe('when multilingual results are enabled', () => {
        const data = { selected: true };
        it('toggles the selected state off and emits the toggleMultilingual event', async() => {
          const wrapper = factory({ mocks: { $auth: { loggedIn: true } }, data });

          const button = wrapper.find('.search-multilingual-button');
          button.trigger('click');
          await wrapper.vm.$nextTick();

          expect(button.attributes('aria-label')).toBe('search.multilingual.enable');
          expect(wrapper.vm.$matomo.trackEvent.calledWith('Multilingual search', 'Disabled multilingual search', 'Español multilingual search toggle')).toBe(true);
          expect(wrapper.emitted('toggleMultilingual').length).toBe(1);
        });
      });

      describe('when multilingual results are disabled', () => {
        const data = { selected: false };
        it('toggles the selected state on and emits the toggleMultilingual event', async() => {
          const wrapper = factory({ mocks: { $auth: { loggedIn: true } }, data });

          const button = wrapper.find('.search-multilingual-button');
          button.trigger('click');
          await wrapper.vm.$nextTick();

          expect(button.attributes('aria-label')).toBe('search.multilingual.disable');
          expect(wrapper.vm.$matomo.trackEvent.calledWith('Multilingual search', 'Enabled multilingual search', 'Español multilingual search toggle')).toBe(true);
          expect(wrapper.emitted('toggleMultilingual').length).toBe(1);
        });
      });
    });
  });
});
