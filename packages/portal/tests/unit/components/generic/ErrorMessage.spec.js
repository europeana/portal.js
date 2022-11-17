import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../../utils';
import BootstrapVue from 'bootstrap-vue';
import ErrorMessage from '@/components/generic/ErrorMessage.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = (propsData = {}) => shallowMountNuxt(ErrorMessage, {
  localVue,
  propsData,
  mocks: {
    $t: (key) => key
  },
  stubs: ['i18n']
});

describe('components/generic/ErrorMessage', () => {
  describe('template', () => {
    it('displays illustrated error with description when available', async() => {
      const propsData = {
        error: 'Item was not found',
        titlePath: 'errorMessage.itemNotFound.title',
        descriptionPath: 'errorMessage.itemNotFound.description',
        illustrationSrc: 'src/assets/img/illustrations/il-item-not-found.svg'
      };
      const wrapper = factory(propsData);

      const text = wrapper.text();

      expect(text).toEqual(propsData.descriptionPath);
    });
  });
});
