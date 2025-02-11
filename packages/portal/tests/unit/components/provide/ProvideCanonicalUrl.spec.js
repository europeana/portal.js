import { createLocalVue } from '@vue/test-utils';
import { mountNuxt } from '../../utils.js';
import ProvideCanonicalUrl from '@/components/provide/ProvideCanonicalUrl.vue';

const localVue = createLocalVue();

const fixtures = {
  config: { app: { baseUrl: 'https://www.example.org' } },
  i18n: { locale: 'en' },
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
const factory = ({ mocks = {}, slots = {} } = {}) => mountNuxt(ProvideCanonicalUrl, {
  localVue,
  mocks: {
    $config: fixtures.config,
    $i18n: fixtures.i18n,
    $route: fixtures.routes.home,
    ...mocks
  },
  slots: {
    ...slots
  }
});

describe('components/provide/ProvideCanonicalUrl', () => {
  describe('canonicalUrl', () => {
    describe('.withBothLocaleAndQuery', () => {
      it('includes both locale and query for home page', () => {
        const mocks = { $route: fixtures.routes.home };
        const wrapper = factory({ mocks });

        const withBothLocaleAndQuery = wrapper.vm.canonicalUrl.withBothLocaleAndQuery;

        expect(withBothLocaleAndQuery).toBe('https://www.example.org/en?query=art');
      });

      it('includes both locale and query for non-home page', () => {
        const mocks = { $route: fixtures.routes.item };
        const wrapper = factory({ mocks });

        const withBothLocaleAndQuery = wrapper.vm.canonicalUrl.withBothLocaleAndQuery;

        expect(withBothLocaleAndQuery).toBe('https://www.example.org/en/item/123/abc?query=art');
      });
    });

    describe('.withOnlyQuery', () => {
      it('includes only query for home page', () => {
        const mocks = { $route: fixtures.routes.home };
        const wrapper = factory({ mocks });

        const withOnlyQuery = wrapper.vm.canonicalUrl.withOnlyQuery;

        expect(withOnlyQuery).toBe('https://www.example.org/?query=art');
      });

      it('includes only query for non-home page', () => {
        const mocks = { $route: fixtures.routes.item };
        const wrapper = factory({ mocks });

        const withOnlyQuery = wrapper.vm.canonicalUrl.withOnlyQuery;

        expect(withOnlyQuery).toBe('https://www.example.org/item/123/abc?query=art');
      });
    });

    describe('.withOnlyLocale', () => {
      it('includes only locale for home page', () => {
        const mocks = { $route: fixtures.routes.home };
        const wrapper = factory({ mocks });

        const withOnlyLocale = wrapper.vm.canonicalUrl.withOnlyLocale;

        expect(withOnlyLocale).toBe('https://www.example.org/en');
      });

      it('includes only locale for non-home page', () => {
        const mocks = { $route: fixtures.routes.item };
        const wrapper = factory({ mocks });

        const withOnlyLocale = wrapper.vm.canonicalUrl.withOnlyLocale;

        expect(withOnlyLocale).toBe('https://www.example.org/en/item/123/abc');
      });
    });

    describe('.withNeitherLocaleNorQuery', () => {
      it('includes neither locale nor query for home page', () => {
        const mocks = { $route: fixtures.routes.home };
        const wrapper = factory({ mocks });

        const withNeitherLocaleNorQuery = wrapper.vm.canonicalUrl.withNeitherLocaleNorQuery;

        expect(withNeitherLocaleNorQuery).toBe('https://www.example.org/');
      });

      it('includes neither locale nor query for non-home page', () => {
        const mocks = { $route: fixtures.routes.item };
        const wrapper = factory({ mocks });

        const withNeitherLocaleNorQuery = wrapper.vm.canonicalUrl.withNeitherLocaleNorQuery;

        expect(withNeitherLocaleNorQuery).toBe('https://www.example.org/item/123/abc');
      });
    });
  });

  describe('provide', () => {
    it('provides canonicalUrl to slotted child components', () => {
      const ChildComponent = {
        inject: ['canonicalUrl'],
        template: '<a :href="canonicalUrl.withBothLocaleAndQuery">Link</a>'
      };
      const slots = { default: ChildComponent };
      const wrapper = factory({ slots });

      const href = wrapper.find('a').attributes('href');

      expect(href).toBe('https://www.example.org/en?query=art');
    });
  });

  describe('head', () => {
    describe('link', () => {
      it('includes a link for hreflang="x-default", rel="alternate" with query, no locale', () => {
        const mocks = { $route: fixtures.routes.home };
        const wrapper = factory({ mocks });

        const link = wrapper.vm.head().link.find((l) => l.hreflang === 'x-default' && l.rel === 'alternate');

        expect(link.href).toBe('https://www.example.org/?query=art');
      });
    });

    describe('meta', () => {
      it('includes meta for property="og-url" with both locale and query', () => {
        const mocks = { $route: fixtures.routes.home };
        const wrapper = factory({ mocks });

        const meta = wrapper.vm.head().meta.find((m) => m.property === 'og:url');

        expect(meta.content).toBe('https://www.example.org/en?query=art');
      });
    });
  });
});
