import { createLocalVue, shallowMount } from '@vue/test-utils';

import mixin from '@/mixins/contentful';

const component = {
  template: '<div/>',
  mixins: [mixin]
};

const factory = ({ mocks = {} } = {}) => shallowMount(component, {
  localVue: createLocalVue(),
  mocks: {
    ...mocks
  }
});

describe('mixins/contentful', () => {
  describe('methods', () => {
    describe('contentfulEntryHasContentType', () => {
      it('is true when `__typename` property matches', () => {
        const wrapper = factory();

        const contentfulEntryHasContentType = wrapper.vm.contentfulEntryHasContentType(
          { '__typename': 'story' }, 'story'
        );

        expect(contentfulEntryHasContentType).toBe(true);
      });

      it('is false when `__typename` property does not match', () => {
        const wrapper = factory();

        const contentfulEntryHasContentType = wrapper.vm.contentfulEntryHasContentType(
          { '__typename': 'landingPage' }, 'story'
        );

        expect(contentfulEntryHasContentType).toBe(false);
      });
    });
  });
});
