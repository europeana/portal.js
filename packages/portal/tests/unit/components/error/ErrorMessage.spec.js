import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../../utils';
import BootstrapVue from 'bootstrap-vue';
import ErrorMessage from '@/components/error/ErrorMessage.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = (propsData = {}) => shallowMountNuxt(ErrorMessage, {
  localVue,
  propsData,
  mocks: {
    $t: (key) => key,
    $te: () => true
  },
  stubs: ['i18n']
});

describe('components/error/ErrorMessage', () => {
  describe('template', () => {
    it('displays illustrated error with text when available', async() => {
      const propsData = {
        error: {
          title: 'Item was not found',
          description: 'The item may have been deleted'
        }
      };
      const wrapper = factory(propsData);

      const text = wrapper.text();

      expect(text).toContain(propsData.error.title);
      expect(text).toContain(propsData.error.description);
    });

    it('displays error message if different from title', async() => {
      const propsData = {
        error: {
          message: 'Network error',
          title: 'Something went wrong'
        }
      };
      const wrapper = factory(propsData);

      const alertMessage = wrapper.find('alertmessage-stub');

      expect(alertMessage.isVisible()).toBe(true);
      expect(alertMessage.attributes('error')).toBe(propsData.error.message);
    });
  });
});
