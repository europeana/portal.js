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
    it('displays illustrated error with description when available', async() => {
      const propsData = {
        error: {
          message: 'Item was not found',
          code: 'itemNotFound'
        }
      };
      const wrapper = factory(propsData);

      const text = wrapper.text();

      expect(text).toEqual('errorMessage.itemNotFound.description');
    });
  });
});
