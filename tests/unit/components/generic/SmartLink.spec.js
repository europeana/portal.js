import { createLocalVue, shallowMount } from '@vue/test-utils';

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

const factory = () => {
  return shallowMount(SmartLink, {
    localVue,
    mocks: {
      localePath: code => window.location.href + code,
      $store,
      $t: () => {}
    }
  });
};

describe('components/generic/SmartLink', () => {
  context('when passed a URL', () => {
    it('should render a link to the site', () => {
      const wrapper = factory();
      wrapper.setProps({ destination: 'https://www.example.org/url-example' });

      wrapper.contains('b-link-stub').should.be.true;
      wrapper.find('b-link-stub').attributes('href').should.exist;
    });

    it('determines if the URL is an external path or not', () => {
      const wrapper = factory();
      wrapper.setProps({ destination: 'https://www.example.org/url-example' });
      wrapper.vm.isExternalLink.should.be.true;

      wrapper.setProps({ destination: '/test' });
      wrapper.vm.isExternalLink.should.be.false;
    });
  });

  context('when passed a URL path', () => {
    it('should render a Nuxt link', () => {
      const wrapper = factory();
      wrapper.setProps({ destination: '/url/path-example' });

      wrapper.contains('b-link-stub').should.be.true;
      wrapper.find('b-link-stub').attributes('to').should.exist;
    });
  });

  context('with a named route object', () => {
    it('should render a Nuxt link', () => {
      const wrapper = factory();
      wrapper.setProps({ destination: { name: 'route-to-somewhere' } });

      wrapper.contains('b-link-stub').should.be.true;
      wrapper.find('b-link-stub').attributes('to').should.exist;
    });
  });
});
