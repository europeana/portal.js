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
  context('when passed a URL', () => {
    it('should render a link to the site', async() => {
      const wrapper = factory();
      await wrapper.setProps({ destination: 'https://www.example.org/url-example' });

      wrapper.contains('b-link-stub').should.be.true;
      wrapper.find('b-link-stub').attributes('href').should.exist;
    });

    it('determines if the URL is an external path or not', async() => {
      const wrapper = factory();
      await wrapper.setData({ internalDomain: '.foo.com' });
      await wrapper.setProps({ destination: 'https://www.example.org/url-example' });
      wrapper.vm.isExternalLink.should.be.true;

      await wrapper.setProps({ destination: '/test' });
      wrapper.vm.isExternalLink.should.be.false;

      await wrapper.setProps({ destination: 'www.foo.com/test' });
      wrapper.vm.isExternalLink.should.be.false;
    });

    it('links data.europeana.eu/item URIs to record page', async() => {
      const wrapper = factory();
      const uri = 'http://data.europeana.eu/item/123/abc';

      await wrapper.setData({ internalDomain: '.foo.com' });
      await wrapper.setProps({ destination: uri });
      wrapper.vm.isExternalLink.should.be.false;

      wrapper.contains('b-link-stub').should.be.true;
      wrapper.find('b-link-stub').attributes('to').should.exist;
    });

    it('returns the correct response if passed a path ending with internal domain ', async() => {
      const wrapper = factory();
      await wrapper.setData({ internalDomain: '.foo.com' });
      await wrapper.setProps({ destination: 'https://www.example.org/www.foo.com' });
      wrapper.vm.isExternalLink.should.be.true;
    });
  });

  context('when passed a URL path', () => {
    it('should render a Nuxt link', async() => {
      const wrapper = factory();
      await wrapper.setProps({ destination: '/url/path-example' });

      wrapper.contains('b-link-stub').should.be.true;
      wrapper.find('b-link-stub').attributes('to').should.exist;
    });
  });

  context('with a named route object', () => {
    it('should render a Nuxt link', async() => {
      const wrapper = factory();
      await wrapper.setProps({ destination: { name: 'route-to-somewhere' } });

      wrapper.contains('b-link-stub').should.be.true;
      wrapper.find('b-link-stub').attributes('to').should.exist;
    });
  });

  describe('.itemIdentifier', () => {
    context('when `destination` is present', () => {
      context('and is a data.europeana.eu item URI', () => {
        it('extracts identifier from it', async() => {
          const identifier = '/123/abc';
          const destination = `http://data.europeana.eu/item${identifier}`;
          const wrapper = factory();
          await wrapper.setProps({ destination });

          wrapper.vm.itemIdentifier.should.eq(identifier);
        });
      });

      context('but is not a data.europeana.eu item URI', () => {
        it('is `null`', async() => {
          const destination = 'http://www.example.org/something';
          const wrapper = factory();
          await wrapper.setProps({ destination });

          (wrapper.vm.itemIdentifier === null).should.be.true;
        });
      });
    });

    context('and `destination` is absent', () => {
      it('is `null`', () => {
        const wrapper = factory();

        (wrapper.vm.itemIdentifier === null).should.be.true;
      });
    });
  });

  describe('.path', () => {
    context('when destination is a data.europeana.eu URI', () => {
      it('returns a route object', async() => {
        const identifierSlug = '123/abc';
        const destination = `http://data.europeana.eu/item/${identifierSlug}`;
        const wrapper = factory();
        await wrapper.setProps({ destination });

        wrapper.vm.path;
        $pathSpy.should.have.been.calledWith({
          name: 'item-all',
          params: { pathMatch: identifierSlug }
        });
      });
    });

    context('when destination is an absolute URL path', () => {
      it('returns a route object', async() => {
        const slug = 'about-us';
        const destination = `/${slug}`;
        const wrapper = factory();
        await wrapper.setProps({ destination });

        wrapper.vm.path;
        $pathSpy.should.have.been.calledWith({
          name: 'slug',
          params: { pathMatch: slug }
        });
      });
    });
  });
});
