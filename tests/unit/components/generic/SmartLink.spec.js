import { createLocalVue, shallowMount } from '@vue/test-utils';
import sinon from 'sinon';

import BootstrapVue from 'bootstrap-vue';
import SmartLink from '../../../../components/generic/SmartLink.vue';

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
        $t: () => {}
      }
    }
  });
};

describe('components/generic/SmartLink', () => {
  context('when passed a URL', () => {
    it('should render a link to the site', () => {
      const wrapper = factory();
      wrapper.setProps({ destination: 'https://www.example.org/url-example' });

      wrapper.find('b-link-stub').attributes('href').should.exist;
    });

    it('returns true if the destination is an external path', () => {
      const wrapper = factory();
      wrapper.setData({ internalDomain: '.foo.com' });
      wrapper.setProps({ destination: 'https://www.example.org/url-example' });
      wrapper.vm.isExternalLink.should.be.true;
    });

    it('returns false if the destination is NOT a path', () => {
      const wrapper = factory();
      wrapper.setData({ internalDomain: '.foo.com' });
      wrapper.setProps({ destination: '/test' });
      wrapper.vm.isExternalLink.should.be.false;
    });

    it('returns false if the destination is NOT an external path', () => {
      const wrapper = factory();
      wrapper.setData({ internalDomain: '.foo.com' });
      wrapper.setProps({ destination: 'www.foo.com/test' });
      wrapper.vm.isExternalLink.should.be.false;
    });

    it('links data.europeana.eu/item URIs to record page', () => {
      const wrapper = factory();
      const uri = 'http://data.europeana.eu/item/123/abc';

      wrapper.setData({ internalDomain: '.foo.com' });
      wrapper.setProps({ destination: uri });
      wrapper.vm.isExternalLink.should.be.false;

      wrapper.find('b-link-stub').attributes('to').should.exist;
    });

    it('returns the correct response if passed a path ending with internal domain ', () => {
      const wrapper = factory();
      wrapper.setData({ internalDomain: '.foo.com' });
      wrapper.setProps({ destination: 'https://www.example.org/www.foo.com' });
      wrapper.vm.isExternalLink.should.be.true;
    });
  });

  context('when passed a URL path', () => {
    it('should render a Nuxt link', () => {
      const wrapper = factory();
      wrapper.setProps({ destination: '/url/path-example' });

      wrapper.find('b-link-stub').attributes('to').should.exist;
    });
  });

  context('with a named route object', () => {
    it('should render a Nuxt link', () => {
      const wrapper = factory();
      wrapper.setProps({ destination: { name: 'route-to-somewhere' } });

      wrapper.find('b-link-stub').attributes('to').should.exist;
    });
  });

  describe('.itemIdentifier', () => {
    context('when `destination` is present', () => {
      context('and is a data.europeana.eu item URI', () => {
        it('extracts identifier from it', () => {
          const identifier = '/123/abc';
          const destination = `http://data.europeana.eu/item${identifier}`;
          const wrapper = factory();
          wrapper.setProps({ destination });

          wrapper.vm.itemIdentifier.should.eq(identifier);
        });
      });

      context('but is not a data.europeana.eu item URI', () => {
        it('is `null`', () => {
          const destination = 'http://www.example.org/something';
          const wrapper = factory();
          wrapper.setProps({ destination });

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
      it('returns a route object', () => {
        const identifierSlug = '123/abc';
        const destination = `http://data.europeana.eu/item/${identifierSlug}`;
        const wrapper = factory();
        wrapper.setProps({ destination });

        wrapper.vm.path;
        $pathSpy.should.have.been.calledWith({
          name: 'item-all',
          params: { pathMatch: identifierSlug }
        });
      });
    });

    context('when destination is an absolute URL path', () => {
      it('returns a route object', () => {
        const slug = 'about-us';
        const destination = `/${slug}`;
        const wrapper = factory();
        wrapper.setProps({ destination });

        wrapper.vm.path;
        $pathSpy.should.have.been.calledWith({
          name: 'slug',
          params: { pathMatch: slug }
        });
      });
    });
  });
});
