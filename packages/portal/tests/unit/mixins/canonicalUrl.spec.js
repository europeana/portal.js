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
    $route: {},
    ...mocks
  }
});

const fixtures = {
  routes: {
    home: {
      path: '/en',
      fullPath: '/en?query=art'
    },
    item: {
      path: '/en/item/123/abc',
      fullPath: '/en/item/123/abc?query=art'
    }
  }
};

describe('mixins/canonicalUrl', () => {
  describe('methods', () => {
    describe('canonicalUrl', () => {
      describe('with fullPath: true', () => {
        const fullPath = true;

        describe('and locale: true', () => {
          const locale = true;
          it('concatenates base URL and route full path, keeping locale', () => {
            const wrapper = factory({ mocks: { $route: fixtures.routes.home } });

            const canonicalUrl = wrapper.vm.canonicalUrl({ fullPath, locale });

            expect(canonicalUrl).toBe('https://www.example.org/en?query=art');
          });
        });

        describe('and locale: false', () => {
          const locale = false;

          describe('on the homepage', () => {
            it('concatenates base URL and route full path, removing locale', () => {
              const wrapper = factory({ mocks: { $route: fixtures.routes.home } });

              const canonicalUrl = wrapper.vm.canonicalUrl({ fullPath, locale });

              expect(canonicalUrl).toBe('https://www.example.org/?query=art');
            });
          });

          describe('on an item page', () => {
            it('concatenates base URL and route full path, removing locale', () => {
              const wrapper = factory({ mocks: { $route: fixtures.routes.item } });

              const canonicalUrl = wrapper.vm.canonicalUrl({ fullPath, locale });

              expect(canonicalUrl).toBe('https://www.example.org/item/123/abc?query=art');
            });
          });
        });
      });

      describe('with fullPath: false', () => {
        const fullPath = false;

        describe('and locale: true', () => {
          const locale = true;
          it('concatenates base URL and route path, keeping locale', () => {
            const wrapper = factory({ mocks: { $route: fixtures.routes.home } });

            const canonicalUrl = wrapper.vm.canonicalUrl({ fullPath, locale });

            expect(canonicalUrl).toBe('https://www.example.org/en');
          });
        });

        describe('and locale: false', () => {
          const locale = false;

          describe('on the homepage', () => {
            it('concatenates base URL and route path, removing locale', () => {
              const wrapper = factory({ mocks: { $route: fixtures.routes.home } });

              const canonicalUrl = wrapper.vm.canonicalUrl({ fullPath, locale });

              expect(canonicalUrl).toBe('https://www.example.org/');
            });
          });

          describe('on an item page', () => {
            it('concatenates base URL and route path, removing locale', () => {
              const wrapper = factory({ mocks: { $route: fixtures.routes.item } });

              const canonicalUrl = wrapper.vm.canonicalUrl({ fullPath, locale });

              expect(canonicalUrl).toBe('https://www.example.org/item/123/abc');
            });
          });
        });
      });
    });
  });
});
