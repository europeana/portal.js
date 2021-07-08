import { createLocalVue, mount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import CiteAttribution from '../../../../src/components/generic/CiteAttribution.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const requiredProps = {
  rightsStatement: 'http://creativecommons.org/publicdomain/mark/1.0/'
};

const factory = () => mount(CiteAttribution, {
  localVue,
  mocks: {
    $path: () => '/',
    $t: (key) => key,
    $config: { app: { internalLinkDomain: null } }
  },
  propsData: requiredProps
});

describe('components/generic/CiteAttribution', () => {
  it('has a link', async() => {
    const url = 'http://www.example.org/something';
    const wrapper = factory();
    await wrapper.setProps({ url });

    const link = wrapper.find('cite a');
    link.attributes().href.should.eq(url);
  });

  it('has an attribution', async() => {
    const wrapper = factory();
    await wrapper.setProps({ creator: 'Johannes Vermeer' });

    const attribution = wrapper.find('cite a');
    attribution.text().should.contain('Johannes Vermeer');
  });

  it('has a rights statement', async() => {
    const wrapper = factory();
    await wrapper.setProps({ rightsStatement: 'http://rightsstatements.org/vocab/InC/1.0/' });

    const rights = wrapper.find('cite a span');
    rights.text().should.contain('In Copyright');
  });

  describe('.linkText', () => {
    it('is concatenates name, creator and provider', async() => {
      const name = 'Something';
      const creator = 'Someone';
      const provider = 'Somewhere';
      const wrapper = factory();
      await wrapper.setProps({ name, creator, provider });

      wrapper.vm.linkText.should.eq('Something, Someone, Somewhere');
    });

    it('omits empty fields', async() => {
      const name = 'Something';
      const provider = 'Somewhere';
      const wrapper = factory();
      await wrapper.setProps({ name, provider });

      wrapper.vm.linkText.should.eq('Something, Somewhere');
    });
  });
});
