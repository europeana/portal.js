import { createLocalVue, shallowMount } from '@vue/test-utils';
import sinon from 'sinon';

import BootstrapVue from 'bootstrap-vue';
import SmartLink from '@/components/generic/SmartLink.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const $store = {
  state: {
    request: {
      domain: null
    }
  }
};

const $path = () => '/';
const $pathSpy = sinon.spy($path);

const factory = () => {
  return shallowMount(SmartLink, {
    localVue,
    mocks: {
      ...{
        $path: $pathSpy,
        $store,
        $t: () => {},
        $config: { app: { internalLinkDomain: null } }
      }
    }
  });
};

describe('components/generic/SmartLink', () => {
  describe('when passed a URL', () => {
    it('should render a link to the site', async() => {
      const wrapper = factory();
      await wrapper.setProps({ destination: 'https://www.example.org/url-example' });

      expect(wrapper.find('b-link-stub').attributes('href')).exist;
    });

    it('determines if the URL is an external path or not', async() => {
      const wrapper = factory();

      await wrapper.setData({ internalDomain: null });
      await wrapper.setProps({ destination: 'https://www.example.org/url-example' });
      expect(wrapper.vm.isExternalLink);

      await wrapper.setData({ internalDomain: 'www.foo.com' });
      await wrapper.setProps({ destination: 'https://www.example.org/url-example' });
      expect(wrapper.vm.isExternalLink);

      await wrapper.setProps({ destination: '/test' });
      expect(wrapper.vm.isExternalLink).toBe(false);

      await wrapper.setProps({ destination: 'https://www.foo.com/test' });
      expect(wrapper.vm.isExternalLink).toBe(false);

      await wrapper.setProps({ destination: 'https://pro.foo.com/test' });
      expect(wrapper.vm.isExternalLink);
    });

    it('links data.europeana.eu/item URIs to record page', async() => {
      const wrapper = factory();
      const uri = 'http://data.europeana.eu/item/123/abc';

      await wrapper.setData({ internalDomain: '.foo.com' });
      await wrapper.setProps({ destination: uri });
      expect(wrapper.vm.isExternalLink).toBe(false);

      expect(wrapper.find('b-link-stub').attributes('to')).exist;
    });

    it('returns the correct response if passed a path ending with internal domain ', async() => {
      const wrapper = factory();
      await wrapper.setData({ internalDomain: '.foo.com' });
      await wrapper.setProps({ destination: 'https://www.example.org/www.foo.com' });
      expect(wrapper.vm.isExternalLink);
    });
  });

  describe('when passed a URL path', () => {
    it('should render a Nuxt link', async() => {
      const wrapper = factory();
      await wrapper.setProps({ destination: '/url/path-example' });

      expect(wrapper.find('b-link-stub').attributes('to')).exist;
    });
  });

  describe('with a named route object', () => {
    it('should render a Nuxt link', async() => {
      const wrapper = factory();
      await wrapper.setProps({ destination: { name: 'route-to-somewhere' } });

      expect(wrapper.find('b-link-stub').attributes('to')).exist;
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

          expect(wrapper.vm.itemIdentifier === null);
        });
      });
    });

    describe('and `destination` is absent', () => {
      it('is `null`', () => {
        const wrapper = factory();

        expect(wrapper.vm.itemIdentifier === null);
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
        expect($pathSpy.calledWith({
          name: 'item-all',
          params: { pathMatch: identifierSlug }
        }));
      });
    });

    describe('when destination is an absolute URL path', () => {
      it('returns a route object', async() => {
        const slug = 'about-us';
        const destination = `/${slug}`;
        const wrapper = factory();
        await wrapper.setProps({ destination });

        wrapper.vm.path;
        expect($pathSpy.calledWith({
          name: 'slug',
          params: { pathMatch: slug },
          query: {}
        }));
      });
    });

    describe('when destination is an absolute URL path with URL params', () => {
      it('returns a route object', async() => {
        const slug = 'account?redirect=/account';
        const destination = `/${slug}`;
        const wrapper = factory();
        await wrapper.setProps({ destination });

        wrapper.vm.path;
        expect($pathSpy.calledWith({
          name: 'slug',
          params: { pathMatch: 'account' },
          query: { redirect: '/account' }
        }));
      });
    });
  });
});
