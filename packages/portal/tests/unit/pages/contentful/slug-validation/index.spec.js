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
    jest.useFakeTimers();
    window.getSlug = sinon.stub();
    window.contentfulExtension = fakeContentfulExtension({
      contentType: { displayField: 'name', sys: { id: 'landingPage' } },
      entryFields: ['name', 'site'],
      fieldReturnValue: slugToValidate,
      location: 'field',
      parameters: { instance: { contentTypes: 'landingPage' } }
    });
  });
  afterAll(() => {
    jest.useRealTimers();
  });

  it('initialises SDK and calls startAutoResizer', () => {
    const wrapper = factory();

    expect(wrapper.vm.contentfulExtensionSdk).toBeDefined();
    expect(wrapper.vm.contentfulExtensionSdk.window.startAutoResizer.called).toBe(true);
  });

  describe('when the entry has a site field', () => {
    it('handles value change', async() => {
      const wrapper = factory();
      await wrapper.vm.$nextTick();
      wrapper.vm.getDebouncedDuplicateStatus = sinon.spy();

      expect(wrapper.vm.siteField.onValueChanged).toBeDefined();

      wrapper.vm.handleSiteChange();
      expect(wrapper.vm.getDebouncedDuplicateStatus.calledWith(slugToValidate)).toBe(true);
    });
  });

  describe('if the slug has duplicates', () => {
    it('sets invalid state', async() => {
      const wrapper = factory();
      await wrapper.vm.$nextTick();

      wrapper.vm.contentfulExtensionSdk.space.getEntries = sinon.stub().resolves({ total: 1, items: [{}] });
      wrapper.vm.handleValueChange(slugToValidate);
      jest.advanceTimersByTime(600);
      await wrapper.vm.$nextTick();

      expect(wrapper.vm.slugField.removeValue.called).toBe(true);
      expect(wrapper.vm.slugField.setInvalid.calledWith(true)).toBe(true);
      expect(wrapper.vm.errorMessage).toBe('This slug has already been published in another entry');
    });
  });
});
