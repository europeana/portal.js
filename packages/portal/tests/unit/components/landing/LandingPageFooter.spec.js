import { createLocalVue, shallowMount } from '@vue/test-utils';
import LandingPageFooter from '@/components/landing/LandingPageFooter.vue';

const localVue = createLocalVue();

const factory = () => shallowMount(LandingPageFooter, {
  localVue,
  mocks: {
    $t: (key) => key
  },
  stubs: ['b-container', 'b-row', 'b-col']
});

describe('components/landing/LandingPageFooter', () => {
  it('has a visually hidden heading', () => {
    const wrapper = factory();
    const heading = wrapper.find('h2[data-qa="footer heading"]');

    expect(heading.exists()).toBe(true);
    expect(heading.classes().includes('visually-hidden')).toBe(true);
  });

  it('displays a mission statement', () => {
    const wrapper = factory();
    const statement = wrapper.find('[data-qa="footer mission statement"]');

    expect(statement.isVisible()).toBe(true);
  });

  it('displays links to social media', () => {
    const wrapper = factory();
    const socials = wrapper.find('[data-qa="footer social links"]');

    expect(socials.isVisible()).toBe(true);
  });

  it('displays a list of links to resources', () => {
    const wrapper = factory();
    const recourses = wrapper.find('[data-qa="footer recourses"]');

    expect(recourses.isVisible()).toBe(true);
  });

  it('displays a disclaimer', () => {
    const wrapper = factory();
    const disclaimer = wrapper.find('[data-qa="footer disclaimer"]');

    expect(disclaimer.isVisible()).toBe(true);
  });
});
