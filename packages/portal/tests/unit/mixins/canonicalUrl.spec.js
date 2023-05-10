import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../utils';

import mixin from '@/mixins/canonicalUrl';

const component = {
  template: '<div></div>',
  mixins: [mixin]
};

const localVue = createLocalVue();

const factory = ({ mocks = {} } = {}) => shallowMountNuxt(component, {
  localVue,
  mocks: {
    $config: {
      app: {
        baseUrl: 'https://www.example.org'
      }
    },
    $i18n: {
      locale: 'en'
    },
    $route: {
      path: '/en',
      fullPath: '/en?query=art'
    },
    ...mocks
  }
});

describe('mixins/canonicalUrl', () => {
  describe('computed', () => {
    describe('canonicalUrl', () => {
      it('concatenates base URL and route full path', () => {
        const wrapper = factory();

        const canonicalUrl = wrapper.vm.canonicalUrl;

        expect(canonicalUrl).toBe('https://www.example.org/en?query=art');
      });
    });

    describe('canonicalUrlWithoutLocale', () => {
      describe('when on the homepage in the current locale', () => {
        it('removes locale from canonical URL', () => {
          const wrapper = factory();

          const canonicalUrl = wrapper.vm.canonicalUrlWithoutLocale;

          expect(canonicalUrl).toBe('https://www.example.org/?query=art');
        });
      });

      describe('when on another page in the current locale', () => {
        const $route = {
          path: '/en/search',
          fullPath: '/en/search?query=art'
        };

        it('removes locale from canonical URL', () => {
          const wrapper = factory({ mocks: { $route } });

          const canonicalUrl = wrapper.vm.canonicalUrlWithoutLocale;

          expect(canonicalUrl).toBe('https://www.example.org/search?query=art');
        });
      });

      describe('when not on a page in the current locale', () => {
        const $route = {
          path: '/iiif',
          fullPath: '/iiif?query=art'
        };

        it('returns canonical URL as-is', () => {
          const wrapper = factory({ mocks: { $route } });

          const canonicalUrl = wrapper.vm.canonicalUrlWithoutLocale;

          expect(canonicalUrl).toBe('https://www.example.org/iiif?query=art');
        });
      });
    });
  });
});
