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
  }
});

describe('components/error/ErrorMessage', () => {
  describe('template', () => {
    it('displays illustrated error with text when available', async() => {
      const propsData = {
        error: {
          i18n: {
            title: 'Item was not found',
            description: 'The item may have been deleted'
          }
        }
      };
      const wrapper = factory(propsData);

      const text = wrapper.text();

      expect(text).toContain(propsData.error.i18n.title);
      expect(text).toContain(propsData.error.i18n.description);
    });

    it('displays error message if different from title', async() => {
      const propsData = {
        error: {
          message: 'Network error',
          i18n: {
            title: 'Something went wrong'
          }
        }
      };
      const wrapper = factory(propsData);

      const alertMessage = wrapper.find('alertmessage-stub');

      expect(alertMessage.isVisible()).toBe(true);
      expect(alertMessage.attributes('error')).toBe(propsData.error.message);
    });
  });

  describe('computed', () => {
    describe('illustrationSrc', () => {
      it('is `null` if error has no code', () => {
        const propsData = {
          error: {
            message: 'Network error'
          }
        };
        const wrapper = factory(propsData);

        const illustrationSrc = wrapper.vm.illustrationSrc;

        expect(illustrationSrc).toBeNull();
      });

      it('is `null` if no image found for the error code', () => {
        const propsData = {
          error: {
            message: 'Network error',
            code: 'genericNetworkError'
          }
        };
        const wrapper = factory(propsData);

        const illustrationSrc = wrapper.vm.illustrationSrc;

        expect(illustrationSrc).toBeNull();
      });

      it('is require()d image if one is available for the error code', () => {
        const propsData = {
          error: {
            code: 'itemNotFound'
          }
        };
        const wrapper = factory(propsData);

        const illustrationSrc = wrapper.vm.illustrationSrc;

        expect(illustrationSrc).toBe('il-item-not-found.svg');
      });
    });
  });
});
