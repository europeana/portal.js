import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt, fakeContentfulExtension } from '../../../utils';
import BootstrapVue from 'bootstrap-vue';

import page from '@/pages/contentful/disabled-single-line/index';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = () => shallowMountNuxt(page, {
  localVue,
  mocks: {
    $t: (key) => key,
    $i18n: {
      locale: 'en',
      localeProperties: { iso: 'en-GB' }
    }
  }
});

describe('pages/contentful/disabled-single-line/index', () => {
  beforeAll(() => {
    window.contentfulExtension = fakeContentfulExtension({ location: 'field', entryFields: ['identifier'], fieldReturnValue: 'original value' });
  });

  describe('head', () => {
    describe('title', () => {
      it('is "Disabled single line - Contentful app"', () => {
        const wrapper = factory();

        expect(wrapper.vm.head().title).toBe('Disabled single line - Contentful app');
      });
    });
  });

  describe('methods', () => {
    describe('updateValue', () => {
      it('updates the current value', async() => {
        const wrapper = factory();

        await wrapper.vm.updateValue('new value');
        expect(wrapper.vm.value).toBe('new value');
      });
    });
  });

  describe('when there is already a value present inthe contentful field', () => {
    it('shows the value in a disabled form field', async() => {
      const wrapper = factory();

      const field = wrapper.find('b-form-input-stub');

      expect(field.props().disabled).toBe(true);
      expect(wrapper.vm.value).toBe('original value'); // set in utils
    });
  });
});
