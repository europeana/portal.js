import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import Hyperlink from '../../../../components/generic/Hyperlink.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = () => shallowMount(Hyperlink, {
  localVue
});

describe('components/generic/Hyperlink', () => {
  context('when passed a URL', () => {
    it('should render a link to the site', () => {
      const wrapper = factory();
      wrapper.setProps({ link: 'https://www.example.org/url-example' });

      wrapper.contains('b-link-stub').should.be.true;
    });
  });

  context('when passed a URL path', () => {
    it('should render a NUXT link', () => {
      const wrapper = factory();
      wrapper.setProps({ link: '/url/path-example' });

      wrapper.contains('b-link-stub').should.be.true;
    });
  });
});
