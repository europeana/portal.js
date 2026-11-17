import { createLocalVue, shallowMount } from '@vue/test-utils';
import sinon from 'sinon';

import SearchDropdown from '@/components/search/SearchDropdown.vue';

const localVue = createLocalVue();

const testProps = {
  name: 'country',
  fields: ['United Kingdom', 'The Netherlands'],
  type: 'checkbox'
};

const factory = (propsData = testProps) => shallowMount(SearchDropdown, {
  localVue,
  propsData,
  mocks: {
    $t: (key) => key
  }
});

describe('components/search/SearchDropdown', () => {
  it('renders a dropdown toggle button', () => {
    const wrapper = factory();

    expect(wrapper.find('.dropdown-toggle').isVisible()).toBe(true);
  });

  describe('when the dropdown toggle receives focus', () => {
    it('opens the options and starts listening to clicks outside', async() => {
      const wrapper = factory();

      wrapper.find('.dropdown-toggle').trigger('focusin');

      expect(wrapper.vm.showDropdown).toBe(true);
      expect(wrapper.vm.clickOutsideConfig.isActive).toBe(true);
    });
  });

  describe('when an option in the dropdown is clicked', () => {
    const option = testProps.fields[0];
    const alreadySelectedOption = testProps.fields[1];
    describe('and type is radio', () => {
      it('emits the changed event with the selected option only', async() => {
        const wrapper = factory({
          ...testProps,
          type: 'radio',
          selected: [alreadySelectedOption]
        });

        wrapper.find(`[data-qa="dropdown item ${option}"]`).trigger('click');

        expect(wrapper.emitted('changed')[0]).toEqual([testProps.name, [option]]);
      });
    });
    describe('and type is checkbox', () => {
      it('emits the changed event with the selected option', async() => {
        const wrapper = factory({
          ...testProps,
          selected: [alreadySelectedOption]
        });

        wrapper.find(`[data-qa="dropdown item ${option}"]`).trigger('click');

        expect(wrapper.emitted('changed')[0]).toEqual([testProps.name, [alreadySelectedOption, option]]);
      });
    });
  });

  describe('when user clicks outside the dropdown', () => {
    it('hides the options', async() => {
      const wrapper = factory();

      await wrapper.setData({ showDropdown: true });
      wrapper.vm.handleClickOutside();

      expect(wrapper.vm.showDropdown).toBe(false);
      expect(wrapper.vm.clickOutsideConfig.isActive).toBe(false);
    });
  });
  describe('when an option is selected', () => {
    const selectedOption = testProps.fields[0];
    it('renders the selected option as a removable tag and removes it from the dropdown', () => {
      const wrapper = factory({ ...testProps, selected: [selectedOption] });

      expect(wrapper.find('.selected-tags').isVisible()).toBe(true);
      expect(wrapper.find('.selected-tags .badge .close').isVisible()).toBe(true);
      expect(wrapper.find(`[data-qa="dropdown item ${selectedOption}"]`).exists()).toBe(false);
      expect(wrapper.find(`[data-qa="dropdown item ${testProps.fields[1]}"]`).exists()).toBe(true);
    });

    describe('and close tag is clicked', () => {
      it('emits the changed event with the clicked item removed from the selected options', async() => {
        const wrapper = factory({ ...testProps, selected: [selectedOption] });

        wrapper.find('.selected-tags .badge .close').trigger('click');

        expect(wrapper.emitted('changed')[0]).toEqual([testProps.name, []]);
      });
    });
  });

  describe('when search enabled', () => {
    it('renders a search form in the dropdown and sets focus on the input', async() => {
      const wrapper = factory({ ...testProps, search: true });
      wrapper.vm.$refs['search-input'].focus = sinon.spy();

      await wrapper.setData({ showDropdown: true });

      expect(wrapper.find('.dropdown-form').isVisible()).toBe(true);

      await wrapper.vm.$nextTick();
      await wrapper.vm.$nextTick();

      expect(wrapper.vm.$refs['search-input'].focus.called).toBe(true);
    });

    describe('and there is a search query', () => {
      it('filters the dropdown list to the search query', async() => {
        const wrapper = factory({ ...testProps, search: true });

        wrapper.vm.dropdownSearchQuery = 'united';
        await wrapper.vm.$nextTick();

        expect(wrapper.findAll('.dropdown-item').length).toBe(1);
        expect(wrapper.find('.dropdown-item').text()).toBe(testProps.fields[0]);
      });
    });
  });
});
