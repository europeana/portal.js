import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import InfoMessage from '@/components/generic/InfoMessage.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = (options = {}) => shallowMount(InfoMessage, {
  localVue,
  mocks: {
    $t: () => {}
  },
  ...options
});

describe('components/generic/InfoMessage', () => {
  it('shows an info message', () => {
    const wrapper = factory({ slots: { default: 'Some information to display' } });

    const message =  wrapper.find('[data-qa="info notice"]');
    expect(message.text()).toContain('Some information to display');
  });

  describe('variant "icon"', () => {
    it('shows an icon', () => {
      const wrapper = factory({ propsData: { variant: 'icon' } });

      const icon =  wrapper.find('[data-qa="info notice"].with-icon span.icon-info');
      expect(icon.exists()).toBe(true);
    });
  });
});
