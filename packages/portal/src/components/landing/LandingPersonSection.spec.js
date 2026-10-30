import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '@test/utils.js';
import sinon from 'sinon';

import LandingPersonSection from '@/components/landing/LandingPersonSection.vue';

const localVue = createLocalVue();

const contentfulResponse = {
  data: {
    personGroupCollection: {
      items: [
        {
          name: 'second'
        }
      ]
    }
  }
};
const contentfulQueryStub = sinon.stub();
contentfulQueryStub.resolves(contentfulResponse);

const factory = (propsData) => shallowMountNuxt(LandingPersonSection, {
  localVue,
  propsData,
  mocks: {
    $contentful: {
      query: contentfulQueryStub
    },
    $i18n: {
      localeProperties: {
        iso: 'en-GB'
      }
    },
    $route: {
      query: {}
    }
  },
  stubs: ['b-container']
});

describe('components/landing/LandingPersonSection', () => {
  describe('with all the people for the section passed in the props data', () => {
    it('displays the person section', () => {
      const wrapper = factory({ section: { identifier: 'sectionID', '__typename': 'PersonGroup', hasPartCollection: { total: 1, items: [{ name: 'first' }] } } });

      const stubedSection = wrapper.find('.person-section-container');

      expect(stubedSection.exists()).toBe(true);
    });
  });

  describe('when additional people need to be fetched', () => {
    it('fetches the extra people from contentful', async() => {
      const wrapper = factory({ section: { identifier: 'sectionID',  '__typename': 'PersonGroup', hasPartCollection: { total: 2, items: [{ name: 'first' }] } } });

      const stubedSection = wrapper.find('.person-section-container');
      await wrapper.vm.fetch();
      expect(contentfulQueryStub.calledWith(sinon.match.object, { identifier: 'sectionID', locale: 'en-GB', preview: false, skip: 1 })).toBe(true);
      expect(stubedSection.exists()).toBe(true);
    });
  });
});
