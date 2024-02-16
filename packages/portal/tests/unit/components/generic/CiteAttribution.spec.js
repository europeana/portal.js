import { createLocalVue, mount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import CiteAttribution from '@/components/generic/CiteAttribution.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const requiredProps = {
  rightsStatement: 'http://creativecommons.org/publicdomain/mark/1.0/'
};

const factory = (propsData = requiredProps) => mount(CiteAttribution, {
  attachTo: document.body,
  localVue,
  mocks: {
    localePath: () => '/',
    $t: (key) => key,
    $config: { app: { internalLinkDomain: null } }
  },
  propsData
});

describe('components/generic/CiteAttribution', () => {
  it('has a link', async() => {
    const url = 'http://www.example.org/something';
    const wrapper = factory();
    await wrapper.setProps({ url });

    const link = wrapper.find('cite a');
    expect(link.attributes().href).toBe(url);
  });

  it('has an attribution', async() => {
    const wrapper = factory();
    await wrapper.setProps({ creator: 'Johannes Vermeer' });

    const attribution = wrapper.find('cite a');
    expect(attribution.text()).toContain('Johannes Vermeer');
  });

  it('has a rights statement', async() => {
    const wrapper = factory();
    await wrapper.setProps({ rightsStatement: 'http://rightsstatements.org/vocab/InC/1.0/' });

    const rights = wrapper.find('cite a span');
    expect(rights.text()).toContain('In Copyright');
  });

  describe('.linkText', () => {
    it('is concatenates name, creator and provider', async() => {
      const name = 'Something';
      const creator = 'Someone';
      const provider = 'Somewhere';
      const wrapper = factory();
      await wrapper.setProps({ name, creator, provider });

      expect(wrapper.vm.linkText).toBe('Something, Someone, Somewhere');
    });

    it('omits empty fields', async() => {
      const name = 'Something';
      const provider = 'Somewhere';
      const wrapper = factory();
      await wrapper.setProps({ name, provider });

      expect(wrapper.vm.linkText).toBe('Something, Somewhere');
    });
  });

  describe('when extended through keyboard navigation', () => {
    it('sets focus on the first link', () => {
      const wrapper = factory({ ...requiredProps, extended: true, setFocus: true });

      const link = wrapper.find('cite a:focus');
      expect(link.exists()).toBe(true);
    });
  });
});
