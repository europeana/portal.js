import { createLocalVue, shallowMount } from '@vue/test-utils';
import sinon from 'sinon';

import BootstrapVue from 'bootstrap-vue';
import SmartLink from '@/components/generic/SmartLink.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const $store = {
  commit: sinon.spy(),
  state: {
    request: {
      domain: null
    }
  }
};

const localePath = () => '/';
const localePathSpy = sinon.spy(localePath);

const factory = ({ mocks = {}, propsData = {} } = {}) => {
  return shallowMount(SmartLink, {
    localVue,
    propsData,
    mocks: {
      localePath: localePathSpy,
      $store,
      $t: (key) => key,
      $config: { app: { internalLinkDomains: null } },
      ...mocks
    }
  });
};

describe('components/generic/SmartLink', () => {
  describe('when passed a URL', () => {
    it('should render a link to the site', async() => {
      const wrapper = factory();
      await wrapper.setProps({ destination: 'https://www.example.org/url-example' });

      expect(wrapper.find('b-link-stub').attributes('href')).toBeDefined();
    });

    describe('isExternalLink', () => {
      const scenarios = [
        {
          internalLinkDomains: null,
          destination: 'https://www.example.org/url-example',
          expectation: true
        },
        {
          internalLinkDomains: ['www.foo.com'],
          destination: 'https://www.example.org/url-example',
          expectation: true
        },
        {
          internalLinkDomains: ['www.foo.com'],
          destination: '/test',
          expectation: false
        },
        {
          internalLinkDomains: ['www.foo.com'],
          destination: 'https://www.foo.com/test',
          expectation: false
        },
        {
          internalLinkDomains: ['www.foo.com'],
          destination: 'https://pro.foo.com/test',
          expectation: true
        }
      ];

      for (const scenario of scenarios) {
        describe(`when internalLinkDomains is ${scenario.internalLinkDomains} and destination is ${scenario.destination}`, () => {
          it(`is ${scenario.expectation}`, () => {
            const mocks = { $config: { app: { internalLinkDomains: scenario.internalLinkDomains } } };
            const propsData = { destination: scenario.destination };
            const wrapper = factory({ mocks, propsData });

            expect(wrapper.vm.isExternalLink).toBe(scenario.expectation);
          });
        });
      }
    });

    it('determines if the URL is a link to a searchable page', async() => {
      const wrapper = factory({ mocks: { localePath: (path) => `/en/${path.params.pathMatch}` } });

      await wrapper.setProps({ destination: '/search' });
      expect(wrapper.vm.isLinkToSearchablePage).toBe(true);

      await wrapper.setProps({ destination: '/search?query=example' });
      expect(wrapper.vm.isLinkToSearchablePage).toBe(true);

      await wrapper.setProps({ destination: '/collections/topic/123' });
      expect(wrapper.vm.isLinkToSearchablePage).toBe(true);

      await wrapper.setProps({ destination: '/collections/organisation/123' });
      expect(wrapper.vm.isLinkToSearchablePage).toBe(true);

      await wrapper.setProps({ destination: '/collections/time/12' });
      expect(wrapper.vm.isLinkToSearchablePage).toBe(true);

      await wrapper.setProps({ destination: '/collections/person/123' });
      expect(wrapper.vm.isLinkToSearchablePage).toBe(true);

      await wrapper.setProps({ destination: '/collections' });
      expect(wrapper.vm.isLinkToSearchablePage).toBe(false);

      await wrapper.setProps({ destination: '/collections/topics' });
      expect(wrapper.vm.isLinkToSearchablePage).toBe(false);

      await wrapper.setProps({ destination: 'https://www.example.eu/collections' });
      expect(wrapper.vm.isLinkToSearchablePage).toBe(false);
    });

    it('links data.europeana.eu/item URIs to record page', async() => {
      const wrapper = factory();
      const uri = 'http://data.europeana.eu/item/123/abc';

      await wrapper.setData({ internalDomain: '.foo.com' });
      await wrapper.setProps({ destination: uri });
      expect(wrapper.vm.isExternalLink).toBe(false);

      expect(wrapper.find('b-link-stub').attributes('to')).toBeDefined();
    });

    it('returns the correct response if passed a path ending with internal domain', async() => {
      const wrapper = factory();
      await wrapper.setData({ internalDomain: '.foo.com' });
      await wrapper.setProps({ destination: 'https://www.example.org/www.foo.com' });
      expect(wrapper.vm.isExternalLink).toBe(true);
    });
  });

  describe('when passed a URL path', () => {
    it('should render a Nuxt link', async() => {
      const wrapper = factory();
      await wrapper.setProps({ destination: '/url/path-example' });

      expect(wrapper.find('b-link-stub').attributes('to')).toBeDefined();
    });
  });

  describe('with a named route object', () => {
    it('should render a Nuxt link', async() => {
      const wrapper = factory();
      await wrapper.setProps({ destination: { name: 'route-to-somewhere' } });

      expect(wrapper.find('b-link-stub').attributes('to')).toBeDefined();
    });
  });

  describe('.itemIdentifier', () => {
    describe('when `destination` is present', () => {
      describe('and is a data.europeana.eu item URI', () => {
        it('extracts identifier from it', async() => {
          const identifier = '/123/abc';
          const destination = `http://data.europeana.eu/item${identifier}`;
          const wrapper = factory();
          await wrapper.setProps({ destination });

          expect(wrapper.vm.itemIdentifier).toBe(identifier);
        });
      });

      describe('but is not a data.europeana.eu item URI', () => {
        it('is `null`', async() => {
          const destination = 'http://www.example.org/something';
          const wrapper = factory();
          await wrapper.setProps({ destination });

          expect(wrapper.vm.itemIdentifier === null).toBe(true);
        });
      });
    });

    describe('and `destination` is absent', () => {
      it('is `null`', () => {
        const wrapper = factory();

        expect(wrapper.vm.itemIdentifier === null).toBe(true);
      });
    });
  });

  describe('.path', () => {
    describe('when destination is a data.europeana.eu URI', () => {
      it('returns a route object', async() => {
        const identifierSlug = '123/abc';
        const destination = `http://data.europeana.eu/item/${identifierSlug}`;
        const wrapper = factory();
        await wrapper.setProps({ destination });

        wrapper.vm.path;
        expect(localePathSpy.calledWith({
          name: 'item-all',
          params: { pathMatch: identifierSlug }
        })).toBe(true);
      });
    });

    describe('when destination is an absolute URL path', () => {
      it('returns a route object', async() => {
        const slug = 'about-us';
        const destination = `/${slug}`;
        const wrapper = factory();
        await wrapper.setProps({ destination });

        wrapper.vm.path;
        expect(localePathSpy.calledWith({
          name: 'slug',
          params: { pathMatch: slug },
          query: {}
        })).toBe(true);
      });
    });

    describe('when destination is an absolute URL path with URL params', () => {
      it('returns a route object', async() => {
        const slug = 'account?redirect=/account';
        const destination = `/${slug}`;
        const wrapper = factory();
        await wrapper.setProps({ destination });

        wrapper.vm.path;
        expect(localePathSpy.calledWith({
          name: 'slug',
          params: { pathMatch: 'account' },
          query: { redirect: '/account' }
        })).toBe(true);
      });
    });
  });

  describe('logSearchLink', () => {
    describe('when loggable prop is set and link is to a search page', () => {
      it('returns true', () => {
        const wrapper = factory({
          mocks: { localePath: (path) => `/en/${path.params.pathMatch}` },
          propsData: { destination: '/search' }
        });

        expect(wrapper.vm.logSearchLink).toEqual(true);
      });
    });
  });

  describe('setLoggableInteraction', () => {
    it('sets the loggable interaction state', () => {
      const wrapper = factory();

      wrapper.vm.setLoggableInteraction();

      expect(wrapper.vm.$store.commit.calledWith('search/setLoggableInteraction', true)).toBe(true);
    });
  });
});
