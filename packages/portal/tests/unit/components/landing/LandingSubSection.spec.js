import { createLocalVue, shallowMount } from '@vue/test-utils';

import LandingSubSection from '@/components/landing/LandingSubSection.vue';

const localVue = createLocalVue();

const factory = (propsData) => shallowMount(LandingSubSection, {
  localVue,
  propsData,
  stubs: ['b-container']
});

describe('components/landing/LandingSubSection', () => {
  describe('methods', () => {
    describe('contentType', () => {
      it('checks the content type to display the relevant component', () => {
        const typeName = 'InfoCardGroup';
        const sections = [{ __typename: typeName }];
        const wrapper = factory({ headline: 'This page is awesome', sections });

        const infoCardGroup = wrapper.vm.contentType(sections[0], typeName);
        expect(infoCardGroup).toBe(true);
      });
    });
  });
});
