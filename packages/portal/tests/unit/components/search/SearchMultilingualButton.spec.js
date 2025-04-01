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
    $features: { multilingualSearch: true },
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
      it('redirects to login', () => {
        const wrapper = factory();

        const button = wrapper.find('.search-multilingual-button');
        button.trigger('click');

        expect(wrapper.vm.$keycloak.login.called).toBe(true);
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
