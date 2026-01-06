import { createLocalVue, shallowMount } from '@vue/test-utils';
import { fakeContentfulExtension } from '@test/utils.js';

import mixin from '@/mixins/contentful/sidebar';

const component = {
  template: '<div/>',
  mixins: [mixin]
};

const factory = () => shallowMount(component, {
  localVue: createLocalVue()
});

const fields = ['name', 'url'];

describe('mixins/contentful/sidebar', () => {
  beforeAll(() => {
    window.contentfulExtension = fakeContentfulExtension({ entryFields: fields });
  });

  describe('data', () => {
    it('adds contentfulExtensionSdk, entry and message', () => {
      const wrapper = factory();

      for (const field of ['contentfulExtensionSdk', 'entry', 'message']) {
        expect(wrapper.vm[field]).not.toBe(undefined);
      }
    });
  });

  describe('mounted', () => {
    it('sets entry with all expected fields from the SDK', async() => {
      const wrapper = factory();
      const extensionSdk = wrapper.vm.contentfulExtensionSdk;
      expect(extensionSdk).toBeDefined();
      const entry = wrapper.vm.entry;

      expect(Object.keys(entry.fields)).toEqual(fields);
    });
  });

  describe('methods', () => {
    describe('showError', () => {
      it('uses a contentful dialog and sets the message to failed', () => {
        const wrapper = factory();
        wrapper.vm.showError('this is the message');
        expect(wrapper.vm.contentfulExtensionSdk.dialogs.openAlert.calledWith({ title: 'Error', message: 'this is the message' })).toBe(true);
        expect(wrapper.vm.message).toBe('Failed');
      });
    });
  });
});
