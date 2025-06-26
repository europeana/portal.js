import { createLocalVue, shallowMount } from '@vue/test-utils';
import { fakeContentfulExtension } from '../../../utils';
import BootstrapVue from 'bootstrap-vue';

import page from '@/pages/contentful/slug-validation/index';
import sinon from 'sinon';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = () => shallowMount(page, {
  localVue
});

const slugToValidate = 'new-slug';

describe('pages/contentful/slug-validation/index', () => {
  beforeAll(() => {
    window.getSlug = sinon.stub();
    window.contentfulExtension = fakeContentfulExtension({
      contentType: { displayField: 'name', sys: { id: 'landingPage' } },
      entryFields: ['name', 'site'],
      fieldReturnValue: slugToValidate,
      location: 'field',
      parameters: { instance: { contentTypes: 'landingPage' } }
    });
  });

  it('initialises SDK and calls startAutoResizer', () => {
    const wrapper = factory();

    expect(wrapper.vm.contentfulExtensionSdk).toBeDefined();
    expect(wrapper.vm.contentfulExtensionSdk.window.startAutoResizer.called).toBe(true);
  });

  describe('when the entry has a site field', () => {
    it('handles value change', async() => {
      const wrapper = factory();
      wrapper.vm.getDebouncedDuplicateStatus = sinon.spy();

      expect(wrapper.vm.siteField.onValueChanged).toBeDefined();

      wrapper.vm.handleSiteChange();
      expect(wrapper.vm.getDebouncedDuplicateStatus.calledWith(slugToValidate)).toBe(true);
    });
  });

  describe('if the slug has duplicates', () => {
    describe('if there is no site field on any of the result entries', () => {
      it('sets invalid state', async() => {
        const wrapper = factory();

        wrapper.vm.contentfulExtensionSdk.space.getEntries = sinon.stub().resolves({ total: 1, items: [{}] });

        wrapper.vm.handleValueChange(slugToValidate);
        await new Promise(resolve => setTimeout(resolve, 600)); // wait for debounce

        expect(wrapper.vm.slugField.removeValue.called).toBe(true);
        expect(wrapper.vm.slugField.setInvalid.calledWith(true)).toBe(true);
        expect(wrapper.vm.errorMessage).toBe('This slug has already been published in another entry');
      });

      describe('and the current site field is set to dataspace-culturalheritage.eu', () => {
        it('ignores duplicates', async() => {
          const wrapper = factory();
          const dataspaceSite = 'dataspace-culturalheritage.eu';

          wrapper.vm.contentfulExtensionSdk.entry.fields.site.getValue = sinon.stub().returns(dataspaceSite);

          wrapper.vm.contentfulExtensionSdk.space.getEntries = sinon.stub().resolves({ total: 1, items: [{}] });

          wrapper.vm.handleValueChange(slugToValidate);
          await new Promise(resolve => setTimeout(resolve, 600)); // wait for debounce

          expect(wrapper.vm.slugField.setValue.calledWith(slugToValidate)).toBe(true);
          expect(wrapper.vm.slugField.setInvalid.calledWith(false)).toBe(true);
          expect(wrapper.vm.errorMessage).toBe(null);
        });
      });
    });
    describe('if there is a site field on any of the result entries', () => {
      describe('and on the current entry', () => {
        it('only considers as duplicate when they are set to the same site', async() => {
          const wrapper = factory();
          const currentSite = 'current-site.eu';

          wrapper.vm.contentfulExtensionSdk.entry.fields.site.getValue = sinon.stub().returns(currentSite);

          wrapper.vm.contentfulExtensionSdk.space.getEntries = sinon.stub().resolves({ total: 1, items: [{ fields: { site: { 'en-GB': currentSite } } }] });

          wrapper.vm.handleValueChange(slugToValidate);
          await new Promise(resolve => setTimeout(resolve, 600)); // wait for debounce

          expect(wrapper.vm.slugField.removeValue.called).toBe(true);
          expect(wrapper.vm.slugField.setInvalid.calledWith(true)).toBe(true);
          expect(wrapper.vm.errorMessage).toBe('This slug has already been published in another entry');
        });
        it('ignores duplicates when not the same site', async() => {
          const wrapper = factory();
          const currentSite = 'current-site.eu';
          const otherSite = 'other-site.eu';

          wrapper.vm.contentfulExtensionSdk.entry.fields.site.getValue = sinon.stub().returns(currentSite);

          wrapper.vm.contentfulExtensionSdk.space.getEntries = sinon.stub().resolves({ total: 1, items: [{ fields: { site: { 'en-GB': otherSite } } }] });

          wrapper.vm.handleValueChange(slugToValidate);
          await new Promise(resolve => setTimeout(resolve, 600)); // wait for debounce

          expect(wrapper.vm.slugField.setValue.calledWith(slugToValidate)).toBe(true);
          expect(wrapper.vm.slugField.setInvalid.calledWith(false)).toBe(true);
          expect(wrapper.vm.errorMessage).toBe(null);
        });
      });
    });
    describe('and there is NO site field on the current entry', () => {
      it('ignores duplicates when in dataspace scope', async() => {
        const wrapper = factory();
        const dataspaceSite = 'dataspace-culturalheritage.eu';

        wrapper.vm.contentfulExtensionSdk.entry.fields.site = undefined;
        wrapper.vm.contentfulExtensionSdk.space.getEntries = sinon.stub().resolves({ total: 1, items: [{ fields: { site: { 'en-GB': dataspaceSite } } }] });

        wrapper.vm.handleValueChange(slugToValidate);
        await new Promise(resolve => setTimeout(resolve, 600)); // wait for debounce

        expect(wrapper.vm.slugField.setValue.calledWith(slugToValidate)).toBe(true);
        expect(wrapper.vm.slugField.setInvalid.calledWith(false)).toBe(true);
        expect(wrapper.vm.errorMessage).toBe(null);
      });
    });
  });
});
