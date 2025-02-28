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
          wrapper.vm.keycloakLogin = sinon.spy();

          const selectButton = wrapper.find('.item-select-button');
          selectButton.trigger('click');

          expect(wrapper.vm.keycloakLogin.called).toBe(true);
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
  });
});
