import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import DownloadButton from '@/components/download/DownloadButton.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = ({ propsData = {}, data = {}, mocks = {} } = {}) => shallowMount(DownloadButton, {
  localVue,
  propsData,
  data: () => ({ ...data }),
  mocks: {
    $features: {},
    $t: (key) => key,
    ...mocks
  }
});

describe('components/download/DownloadButton', () => {
  const propsData = {
    url: 'https://example.org/image.jpeg',
    identifier: '/123/abc'
  };

  describe('computed', () => {
    describe('isDownloadValidationRequired', () => {
      describe('when feature is disabled', () => {
        const $features = { downloadValidation: false };
        it('is `false`', () => {
          const wrapper = factory({ propsData, mocks: { $features } });

          const isDownloadValidationRequired = wrapper.vm.isDownloadValidationRequired;

          expect(isDownloadValidationRequired).toBe(false);
        });
      });

      describe('when feature is enabled', () => {
        const $features = { downloadValidation: true };

        describe('but URL is already validated', () => {
          const data = { urlValidated: true, validationNetworkError: false };

          it('is `false`', () => {
            const wrapper = factory({ propsData, data, mocks: { $features } });

            const isDownloadValidationRequired = wrapper.vm.isDownloadValidationRequired;

            expect(isDownloadValidationRequired).toBe(false);
          });
        });

        describe('but URL validatation attempt failed with network error', () => {
          const data = { urlValidated: false, validationNetworkError: true };

          it('is `false`', () => {
            const wrapper = factory({ propsData, data, mocks: { $features } });

            const isDownloadValidationRequired = wrapper.vm.isDownloadValidationRequired;

            expect(isDownloadValidationRequired).toBe(false);
          });
        });

        describe('and URL validatation has not been attempted', () => {
          const data = { urlValidated: false, validationNetworkError: false };

          it('is `true`', () => {
            const wrapper = factory({ propsData, data, mocks: { $features } });

            const isDownloadValidationRequired = wrapper.vm.isDownloadValidationRequired;

            expect(isDownloadValidationRequired).toBe(true);
          });
        });
      });
    });
  });
});
