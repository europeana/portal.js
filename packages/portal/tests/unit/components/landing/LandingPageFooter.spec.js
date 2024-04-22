import { createLocalVue, shallowMount } from '@vue/test-utils';
import LandingPageFooter from '@/components/landing/LandingPageFooter.vue';

const localVue = createLocalVue();

const factory = () => shallowMount(LandingPageFooter, {
  localVue,
  mocks: {
    $t: (key) => key
  }
});

describe('components/landing/LandingPageFooter', () => {
  it('render the page footer', () => {
    const wrapper = factory();
    const pageFooter = wrapper.find('pagefooter-stub');

    expect(pageFooter.isVisible()).toBe(true);
  });
});
