import { createLocalVue, shallowMount } from '@vue/test-utils';
import SearchMultilingualButton from '@/components/search/SearchMultilingualButton';
import BootstrapVue from 'bootstrap-vue';
import sinon from 'sinon';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = ({ mocks = {}, propsData = {} } = {}) => shallowMount(SearchMultilingualButton, {
  attachTo: document.body,
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
  propsData,
  stubs: ['NewFeatureTooltip']
});

describe('components/search/SearchMultilingualButton', () => {
  beforeEach(() => {
    sinon.resetHistory();
  });
  it('renders a button in non-enabled state', () => {
    const wrapper = factory();

    const button = wrapper.find('.search-multilingual-button');

    expect(button.attributes('aria-label')).toBe('search.multilingual.enable');
  });

  describe('when clicked', () => {
    describe('and user is not logged in', () => {
      describe('and click is not a touch tap', () => {
        it('redirects to login', () => {
          const wrapper = factory();

          const button = wrapper.find('.search-multilingual-button');
          button.trigger('click');

          expect(wrapper.vm.$keycloak.login.called).toBe(true);
        });
      });

      describe('and click is from a touch interaction', () => {
        it('does not login and increases the touchTap count by 1', () => {
          const wrapper = factory();

          const button = wrapper.find('.search-multilingual-button');
          button.trigger('touchstart');
          button.trigger('click');

          expect(wrapper.vm.$keycloak.login.called).toBe(false);
          expect(wrapper.vm.touchTapCount).toEqual(1);
        });

        describe('on a second click', () => {
          it('redirects to login and resets the touchTapCount to 0', () => {
            const wrapper = factory();

            const button = wrapper.find('.search-multilingual-button');
            button.trigger('touchstart');
            button.trigger('click');

            expect(wrapper.vm.$keycloak.login.called).toBe(false);
            expect(wrapper.vm.touchTapCount).toEqual(1);

            button.trigger('touchstart');
            button.trigger('click');

            expect(wrapper.vm.$keycloak.login.called).toBe(true);
            expect(wrapper.vm.touchTapCount).toEqual(0);
          });
        });
      });
    });

    describe('and user is logged in', () => {
      describe('when multilingual results are enabled', () => {
        const propsData = { value: true };

        describe('and click is not a touch tap', () => {
          it('emits the input event to toggle the selected state and hides the tooltip', async() => {
            const wrapper = factory({ mocks: { $auth: { loggedIn: true } }, propsData });

            const button = wrapper.find('.search-multilingual-button');
            button.trigger('click');
            await wrapper.vm.$nextTick();

            expect(wrapper.vm.$matomo.trackEvent.calledWith('Multilingual search', 'Disabled multilingual search', 'Español multilingual search toggle')).toBe(true);
            expect(wrapper.emitted('input')).toEqual([[false]]);
            expect(wrapper.vm.showTooltip).toEqual(false);
          });
        });

        describe('and click is from a touch interaction', () => {
          it('emits the input event to toggle the selected state and hides the tooltip', async() => {
            const wrapper = factory({ mocks: { $auth: { loggedIn: true } }, propsData });

            const button = wrapper.find('.search-multilingual-button');
            button.trigger('touchstart');
            button.trigger('click');
            await wrapper.vm.$nextTick();

            expect(button.attributes('aria-label')).toBe('search.multilingual.disable');
            expect(wrapper.emitted('input')).toEqual([[false]]);
            expect(wrapper.vm.showTooltip).toEqual(false);
          });
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
