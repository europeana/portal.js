import { createLocalVue, shallowMount } from '@vue/test-utils';

import mixin from '@/mixins/landingPage';

const component = {
  template: '<div/>',
  mixins: [mixin]
};

const factory = ({ mocks = {} } = {}) => shallowMount(component, {
  localVue: createLocalVue(),
  mocks: {
    $route: { params: {} },
    ...mocks
  }
});

describe('mixins/landingPage', () => {
  describe('data', () => {
    describe('landingPageId', () => {
      describe('when route slug is "share-your-collections"', () => {
        const $route = { params: { pathMatch: 'share-your-collections' } };

        it('is "share-your-collections"', () => {
          const wrapper = factory({ mocks: { $route } });

          const landingPageId = wrapper.vm.landingPageId;

          expect(landingPageId).toBe('share-your-collections');
        });
      });

      describe('when route slug is "dataspace-culturalheritage"', () => {
        const $route = { params: { pathMatch: 'dataspace-culturalheritage' } };

        it('is "ds4ch"', () => {
          const wrapper = factory({ mocks: { $route } });

          const landingPageId = wrapper.vm.landingPageId;

          expect(landingPageId).toBe('ds4ch');
        });
      });

      describe('when route slug is black-history-month"', () => {
        const $route = { params: { pathMatch: 'black-history-month' } };

        it('is "black-history-month"', () => {
          const wrapper = factory({ mocks: { $route } });

          const landingPageId = wrapper.vm.landingPageId;

          expect(landingPageId).toBe('black-history-month');
        });
      });

      it('detects config for landing page-based home page', () => {
        const $config = { app: { homeLandingPageSlug: 'dataspace-culturalheritage' } };
        const $route = { params: {} };

        const wrapper = factory({ mocks: { $config, $route } });

        const landingPageId = wrapper.vm.landingPageId;

        expect(landingPageId).toBe('ds4ch');
      });
    });
  });
});
