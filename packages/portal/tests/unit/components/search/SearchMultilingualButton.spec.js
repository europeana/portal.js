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
    $cookies: { set: sinon.spy() },
    $keycloak: {
      login: sinon.spy()
    },
    $t: (key) => key,
    ...mocks
  }
});

describe('components/search/SearchMultilingualButton', () => {
  it('renders a button in not enabled state', () => {
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
      it('toggles the multilingualSearchEnabled state and emits the toggleMultilingual event', async() => {
        const wrapper = factory({ mocks: { $auth: { loggedIn: true } } });

        const button = wrapper.find('.search-multilingual-button');

        button.trigger('click');
        await wrapper.vm.$nextTick();

        const buttonFilledIcon = wrapper.find('.search-multilingual-button .icon-translate');

        expect(button.attributes('aria-label')).toBe('search.multilingual.disable');
        expect(buttonFilledIcon.isVisible()).toBe(true);
        expect(wrapper.emitted('toggleMultilingual').length).toBe(1);
        expect(wrapper.vm.$cookies.set.calledWith('multilingualSearch', true)).toBe(true);
      });
    });
  });

  describe('when multilingualState prop is passed', () => {
    it('updates multilingualSearchEnabled to the multilingualState', async() => {
      const wrapper = factory();
      wrapper.setProps({ multilingualState: true });
      await wrapper.vm.$nextTick();

      expect(wrapper.vm.multilingualSearchEnabled).toEqual(true);
    });
  });
});
