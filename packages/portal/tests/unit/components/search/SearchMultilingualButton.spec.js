import { createLocalVue, shallowMount } from '@vue/test-utils';
import SearchMultilingualButton from '@/components/search/SearchMultilingualButton';
import BootstrapVue from 'bootstrap-vue';
import sinon from 'sinon';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = ({ mocks = {} } = {}) => shallowMount(SearchMultilingualButton, {
  attachTo: document.body,
  localVue,
  mocks: {
    $auth: { loggedIn: false },
    $keycloak: {
      login: sinon.spy()
    },
    $t: (key) => key,
    ...mocks
  }
});

describe('components/search/SearchMultilingualButton', () => {
  it('renders a button in non-selected state', () => {
    const wrapper = factory();

    const button = wrapper.find('.search-multilingual-button');

    expect(button.attributes('aria-label')).toBe('search.multilingual.enable');
  });

  describe('when clicked', () => {
    describe('and user is not logged in', () => {
      describe('and click is not a touch tap', () => {
        it('redirects to login and hides the tooltip', () => {
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
      describe('and click is not a touch tap', () => {
        it('toggles selected, emits toggleMultilingual and hides the tooltip', async() => {
          const wrapper = factory({ mocks: { $auth: { loggedIn: true } } });
          wrapper.vm.hideTooltips = sinon.spy();

          const button = wrapper.find('.search-multilingual-button');
          button.trigger('click');
          await wrapper.vm.$nextTick();

          expect(button.attributes('aria-label')).toBe('search.multilingual.disable');
          expect(wrapper.emitted('toggleMultilingual').length).toBe(1);
          expect(wrapper.vm.hideTooltips.called).toBe(true);
        });
      });

      describe('and click is from a touch interaction', () => {
        it('toggles selected, emits toggleMultilingual and hides the tooltip', async() => {
          const wrapper = factory({ mocks: { $auth: { loggedIn: true } } });
          wrapper.vm.hideTooltips = sinon.spy();

          const button = wrapper.find('.search-multilingual-button');
          button.trigger('touchstart');
          button.trigger('click');
          await wrapper.vm.$nextTick();

          expect(button.attributes('aria-label')).toBe('search.multilingual.disable');
          expect(wrapper.emitted('toggleMultilingual').length).toBe(1);
          expect(wrapper.vm.hideTooltips.called).toBe(true);
        });
      });
    });
  });
});
