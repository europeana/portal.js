import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';

import LandingCallToAction from '@/components/landing/LandingCallToAction.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = (propsData) => shallowMount(LandingCallToAction, {
  localVue,
  propsData
});

describe('components/landing/LandingCallToAction', () => {
  it('passes the props to a primaryCallToAction component', () => {
    const wrapper = factory({ text: 'this is the text', link: { text: 'link text', url: 'https://example.com/link' } });

    const ctaElement = wrapper.find('contentprimarycalltoaction-stub');

    expect(ctaElement.attributes('text')).toBe('this is the text');
    expect(ctaElement.attributes('link')).toBe('[object Object]');
  });
});
