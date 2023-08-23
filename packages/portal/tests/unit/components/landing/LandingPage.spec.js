import { createLocalVue, shallowMount } from '@vue/test-utils';

import LandingPage from '@/components/landing/LandingPage.vue';

const localVue = createLocalVue();

const factory = (propsData) => shallowMount(LandingPage, {
  localVue,
  propsData,
  stubs: ['b-container']
});

describe('components/landing/LandingPage', () => {
  describe('methods', () => {
    describe('contentType', () => {
      it('checks the content type to display the relevant component', () => {
        const typeName = 'IllustrationGroup';
        const sections = [{ __typename: typeName }];
        const wrapper = factory({ headline: 'This page is awesome', sections });

        const illustrationGroup = wrapper.vm.contentType(sections[0], typeName);
        expect(illustrationGroup).toBe(true);
      });
    });
  });
});
