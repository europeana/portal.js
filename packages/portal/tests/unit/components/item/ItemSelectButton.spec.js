import { createLocalVue, shallowMount } from '@vue/test-utils';
import ItemSelectButton from '@/components/item/ItemSelectButton';
import BootstrapVue from 'bootstrap-vue';
import sinon from 'sinon';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = ({ mocks = {} } = {}) => shallowMount(ItemSelectButton, {
  localVue,
  attachTo: document.body,
  directives: { 'b-tooltip': () => {} },
  mocks: {
    $auth: { loggedIn: false },
    $features: { itemMultiSelect: true },
    $keycloak: {
      login: sinon.spy()
    },
    $t: (key) => key,
    ...mocks
  }
});

describe('components/item/ItemSelectButton', () => {
  describe('when itemMultiSelect feature toggle is enabled', () => {
    it('renders a button in non-selected state', () => {
      const wrapper = factory();

      const selectButton = wrapper.find('.item-select-button');

      expect(selectButton.attributes('aria-label')).toBe('set.actions.selectItems');
    });

    describe('when clicked', () => {
      describe('and user is not logged in', () => {
        it('redirects to login', () => {
          const wrapper = factory();

          const selectButton = wrapper.find('.item-select-button');
          selectButton.trigger('click');

          expect(wrapper.vm.$keycloak.login.called).toBe(true);
        });
      });

      describe('and user is logged in', () => {
        it('toggles the select state and emits the select event', async() => {
          const wrapper = factory({ mocks: { $auth: { loggedIn: true } } });

          const selectButton = wrapper.find('.item-select-button');
          selectButton.trigger('click');
          await wrapper.vm.$nextTick();

          expect(selectButton.attributes('aria-label')).toBe('set.actions.cancelSelection');
          expect(wrapper.emitted('select').length).toBe(1);
        });
      });
    });

    describe('when select state changes to true', () => {
      it('starts listening to keyup events', async() => {
        sinon.spy(window, 'addEventListener');
        const wrapper = factory();
        await wrapper.setData({ selected: true });

        expect(window.addEventListener.calledWith('keyup', sinon.match.func)).toBe(true);
      });
      describe('and hitting Escape', () => {
        it('calls toggle to cancel selection', () => {
          const wrapper = factory();
          wrapper.vm.toggle = sinon.spy();
          wrapper.setData({ selected: true });
          const keyupEscapeEvent = new KeyboardEvent('keyup', { key: 'Escape' });

          wrapper.vm.handleKeyup(keyupEscapeEvent);

          expect(wrapper.vm.toggle.called).toBe(true);
        });
      });
    });

    describe('when select state changes to false', () => {
      it('stops listening to keyup events', async() => {
        sinon.spy(window, 'removeEventListener');
        const wrapper = factory();
        await wrapper.setData({ selected: true });
        await wrapper.setData({ selected: false });

        expect(window.removeEventListener.calledWith('keyup', sinon.match.func)).toBe(true);
      });
    });
  });
});
