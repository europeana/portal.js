import { createLocalVue, shallowMount } from '@vue/test-utils';
import SearchMultilingualButton from '@/components/search/SearchMultilingualButton';
import BootstrapVue from 'bootstrap-vue';
import sinon from 'sinon';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = ({ mocks = {}, propsData = {} } = {}) => shallowMount(SearchMultilingualButton, {
  localVue,
  mocks: {
    $auth: { loggedIn: false },
    $cookies: { set: sinon.spy() },
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
  propsData
});

describe('components/search/SearchMultilingualButton', () => {
  beforeEach(() => {
    sinon.resetHistory();
  });
  it('renders a button in non-enabled state', () => {
    const wrapper = factory();

    const button = wrapper.find('.search-multilingual-button');
    const buttonOutlinedIcon = wrapper.find('.search-multilingual-button .icon-translate-outlined');

    expect(button.attributes('aria-label')).toBe('search.multilingual.enable');
    expect(buttonOutlinedIcon.isVisible()).toBe(true);
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
        const propsData = { value: true };

        it('emits the input event to toggle the selected state off', () => {
          const wrapper = factory({ mocks: { $auth: { loggedIn: true } }, propsData });

          const button = wrapper.find('.search-multilingual-button');
          button.trigger('click');

          expect(wrapper.vm.$matomo.trackEvent.calledWith('Multilingual search', 'Disabled multilingual search', 'Español multilingual search toggle')).toBe(true);
          expect(wrapper.vm.$cookies.set.calledWith('multilingualSearch', false)).toBe(true);
          expect(wrapper.emitted('input')).toEqual([[false]]);
        });
      });

      describe('when multilingual results are disabled', () => {
        const propsData = { value: false };

        it('emits the input event to toggle the selected state on', () => {
          const wrapper = factory({ mocks: { $auth: { loggedIn: true } }, propsData });

          const button = wrapper.find('.search-multilingual-button');
          button.trigger('click');

          expect(wrapper.vm.$matomo.trackEvent.calledWith('Multilingual search', 'Enabled multilingual search', 'Español multilingual search toggle')).toBe(true);
          expect(wrapper.vm.$cookies.set.calledWith('multilingualSearch', true)).toBe(true);
          expect(wrapper.emitted('input')).toEqual([[true]]);
        });
      });
    });
  });
});
