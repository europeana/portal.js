import { createLocalVue, shallowMount } from '@vue/test-utils';
import PersonContactLinks from '@/components/person/PersonContactLinks.vue';

const localVue = createLocalVue();

const linkedInProfile = 'https://www.linkedin.com/profile';

const factory = (propsData = testProps) =>
  shallowMount(PersonContactLinks, {
    localVue,
    propsData
  });

describe('components/content/PersonContactLinks', () => {
  describe('when there is an email passed', () => {
    it('displays an email link', () => {
      const wrapper = factory({ email: 'example@org.eu' });

      expect(wrapper.find('smartlink-stub').attributes('destination')).toContain('mailto:');
    });
  });
  describe('when there is a website passed', () => {
    describe('and it is to a LinkedIn profile', () => {
      it('displays a LinkedIn link', () => {
        const wrapper = factory({ website: linkedInProfile });

        expect(wrapper.find('smartlink-stub').attributes('destination')).toEqual(linkedInProfile);
      });
    });
    describe('and it is NOT to a LinkedIn profile', () => {
      it('displays a LinkedIn link', () => {
        const wrapper = factory({ website: 'https://www.example.eu' });

        expect(wrapper.find('smartlink-stub').exists()).toBe(false);
      });
    });
  });
});
