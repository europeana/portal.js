import { createLocalVue, shallowMount } from '@vue/test-utils';
import PersonCard from '@/components/person/PersonCard.vue';

const localVue = createLocalVue();

const factory = (propsData) => shallowMount(PersonCard, {
  localVue,
  propsData,
  directives: { 'b-tooltip': () => {} },
  mocks: {
    $t: (key) => key
  }
});

describe('components/person/PersonCard', () => {
  it('renders a person card', () => {
    const wrapper = factory();

    expect(wrapper.find('.person-card').isVisible()).toBe(true);
  });

  describe('when there is an image', () => {
    it('renders a lazy loaded optimised image', () => {
      const wrapper = factory({ image: {
        url: 'https://www.example.eu/portrait.webp',
        width: 200,
        height: 200,
        contentType: 'image/webp'
      } });

      expect(wrapper.find('imageoptimised-stub').isVisible()).toBe(true);
      expect(wrapper.find('imageoptimised-stub').attributes('lazy')).toBe('true');
    });
  });

  describe('when there is no image', () => {
    it('renders a fallback image', () => {
      const wrapper = factory();

      expect(wrapper.find('imageoptimised-stub').exists()).toBe(false);
      expect(wrapper.find('.person-fallback-image').isVisible()).toBe(true);
    });
  });

  describe('when there is an email', () => {
    it('renders an e-mail button link', () => {
      const wrapper = factory({ email: 'info@example.eu' });

      expect(wrapper.find('.email-btn').isVisible()).toBe(true);
    });
  });

  describe('when there is a LinkedIn url', () => {
    it('renders a LinkedIn button link', () => {
      const wrapper = factory({ linkedIn: 'https://www.linkedin.com/profile' });

      expect(wrapper.find('.linkedin-btn').isVisible()).toBe(true);
    });
  });

  describe('when there is a name', () => {
    it('renders a name', () => {
      const wrapper = factory({ name: 'Frida Kahlo' });

      expect(wrapper.find('.person-name').isVisible()).toBe(true);
    });
  });

  describe('when there is a role', () => {
    it('renders a role', () => {
      const wrapper = factory({ role: 'Frida Kahlo' });

      expect(wrapper.find('.person-role').isVisible()).toBe(true);
    });
  });
});
