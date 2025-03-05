import { createLocalVue, shallowMount } from '@vue/test-utils';
import ItemSelectionToolbar from '@/components/item/ItemSelectionToolbar';
import BootstrapVue from 'bootstrap-vue';
import sinon from 'sinon';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = ({ mocks = {} } = {}) => shallowMount(ItemSelectionToolbar, {
  localVue,
  attachTo: document.body,
  directives: { 'b-tooltip': () => {} },
  mocks: {
    $auth: { loggedIn: false },
    $features: { itemMultiSelect: true },
    $keycloak: {
      login: sinon.spy()
    },
    $store: {
      state: {
        set: {
          selectedItems: []
        }
      }
    },
    $t: (key) => key,
    $tc: (key, count) => `${count} ${key}`,
    ...mocks
  }
});

describe('components/item/ItemSelectionToolbar', () => {
  describe('when itemMultiSelect feature toggle is enabled', () => {
    it('renders the toolbar', () => {
      const wrapper = factory();

      const selectionToolbar = wrapper.find('.multiSelectToolbar');

      expect(selectionToolbar.text()).toBe('0 set.toolbar.info');
    });
  });
});
