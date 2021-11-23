import { createLocalVue, shallowMount } from '@vue/test-utils';
import { fakeContentfulExtension } from '../../utils';
// import sinon from 'sinon';

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
  before('supply fake contentful extension', () => {
    window.contentfulExtension = fakeContentfulExtension(fields);
  });

  describe('data', () => {
    it('adds contentfulExtensionSdk, entry and message', () => {
      const wrapper = factory();

      for (const field of ['contentfulExtensionSdk', 'entry', 'message']) {
        (wrapper.vm[field] === undefined).should.not.be.true;
      }
    });
  });

  describe('mounted', () => {
    it('sets entry with all expected fields from the SDK', async() => {
      const wrapper = factory();
      const extensionSdk = wrapper.vm.contentfulExtensionSdk;
      extensionSdk.should.exist;
      const entry = wrapper.vm.entry;

      Object.keys(entry.fields).should.eql(fields);
    });
  });

  describe('methods', () => {
    describe('showError', () => {
      it('uses a contentful dialog and sets the message to failed', () => {
        const wrapper = factory();
        wrapper.vm.showError('this is the message');
        wrapper.vm.contentfulExtensionSdk.dialogs.openAlert.should.have.been.calledWith({ title: 'Error', message: 'this is the message' });
        wrapper.vm.message.should.eq('Failed');
      });
    });
  });
});
