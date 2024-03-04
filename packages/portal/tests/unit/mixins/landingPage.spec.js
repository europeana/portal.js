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
      describe('when route slug is "share-your-data"', () => {
        const $route = { params: { pathMatch: 'share-your-data' } };

        it('is "share-your-data"', () => {
          const wrapper = factory({ mocks: { $route } });

          const landingPageId = wrapper.vm.landingPageId;

          expect(landingPageId).toBe('share-your-data');
        });
      });

      describe('when route slug is "microsite/DS4CH.eu"', () => {
        const $route = { params: { pathMatch: 'microsite/DS4CH.eu' } };

        it('is "ds4ch"', () => {
          const wrapper = factory({ mocks: { $route } });

          const landingPageId = wrapper.vm.landingPageId;

          expect(landingPageId).toBe('ds4ch');
        });
      });
    });
  });
});
