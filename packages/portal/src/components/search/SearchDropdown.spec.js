import { createLocalVue, shallowMount } from '@vue/test-utils';

import SearchDropdown from '@/components/search/SearchDropdown.vue';

const localVue = createLocalVue();

const testProps = {
  name: 'country',
  fields: [{ label: 'United Kingdom' }, { label: 'The Netherlands' }]
};

const factory = (propsData = testProps) => shallowMount(SearchDropdown, {
  localVue,
  propsData,
  mocks: {
    $t: (key) => key
  }
});

describe('components/search/SearchDropdown', () => {
  describe('template', () => {
    it('renders a dropdown toggle button', () => {
      const wrapper = factory();

      expect(wrapper.find('.dropdown-toggle').isVisible()).toBe(true);
    });

    describe('when an option is selected', () => {
      const selectedOption = testProps.fields[0];
      it('renders the selected option as a removable tag and removes it from the dropdown', () => {
        const wrapper = factory({ ...testProps, selected: [selectedOption] });

        expect(wrapper.find('.selected-tags').isVisible()).toBe(true);
        expect(wrapper.find('.selected-tags .badge .close').isVisible()).toBe(true);
        expect(wrapper.find(`[data-qa="dropdown item ${selectedOption.label}"]`).exists()).toBe(false);
        expect(wrapper.find(`[data-qa="dropdown item ${testProps.fields[1].label}"]`).exists()).toBe(true);
      });

      describe('and close tag is clicked', () => {
        it('emits the changed event with the clicked item removed from the selected options', async() => {
          const wrapper = factory({ ...testProps, selected: [selectedOption] });

          wrapper.find('.selected-tags .badge .close').trigger('click');

          expect(wrapper.emitted('changed')[0][0]).toEqual(testProps.name, []);
        });
      });
    });
  });
});
