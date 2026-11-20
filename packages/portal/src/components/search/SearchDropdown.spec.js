import { createLocalVue, shallowMount } from '@vue/test-utils';
import sinon from 'sinon';

import SearchDropdown from '@/components/search/SearchDropdown.vue';

const localVue = createLocalVue();

const testProps = {
  name: 'country',
  fields: ['United Kingdom', 'The Netherlands'],
  fieldsFetched: true,
  type: 'checkbox'
};

const factory = (propsData = testProps, mocks) => shallowMount(SearchDropdown, {
  localVue,
  propsData,
  mocks: {
    $t: (key) => key,
    $route: {},
    $router: { push: sinon.spy() },
    ...mocks
  },
  stubs: ['NuxtLink']
});

describe('components/search/SearchDropdown', () => {
  it('renders a dropdown toggle button', () => {
    const wrapper = factory();

    expect(wrapper.find('.dropdown-toggle').isVisible()).toBe(true);
  });

  describe('when the dropdown toggle is clicked', () => {
    it('emits showDropdown , opens the options and starts listening to clicks outside', async() => {
      const wrapper = factory();

      wrapper.find('.dropdown-toggle').trigger('click');

      expect(wrapper.emitted('showDropdown').length).toBe(1);
      expect(wrapper.vm.showDropdown).toBe(true);
      expect(wrapper.vm.clickOutsideConfig.isActive).toBe(true);
    });
  });

  describe('filterToLink', () => {
    const option = testProps.fields[0];
    const alreadySelectedOption = testProps.fields[1];
    describe('when type is radio', () => {
      it('returns an updated route with the selected option only', () => {
        const wrapper = factory({
          ...testProps,
          type: 'radio'
        },
        { $route: { query: { country: alreadySelectedOption } } });

        expect(wrapper.vm.filterToLink(option)).toEqual({ query: { country: 'United Kingdom', page: 1 } });
      });
    });
    describe('when type is checkbox', () => {
      it('returns an updated route with the selected options', () => {
        const wrapper = factory(testProps, { $route: { query: { country: alreadySelectedOption } } });

        expect(wrapper.vm.filterToLink(option)).toEqual({ query: { country: 'The Netherlands,United Kingdom', page: 1 } });
      });
    });
  });

  describe('when user clicks outside the dropdown', () => {
    it('hides the options', async() => {
      const wrapper = factory();

      await wrapper.setData({ showDropdown: true });
      wrapper.vm.closeDropdown();

      expect(wrapper.vm.showDropdown).toBe(false);
      expect(wrapper.vm.clickOutsideConfig.isActive).toBe(false);
    });
  });
  describe('when an option is selected', () => {
    const selectedOption = testProps.fields[0];
    it('renders the selected option as a removable tag and removes it from the dropdown', async() => {
      const wrapper = factory(testProps, { $route: { query: { country: selectedOption } } });

      expect(wrapper.find('.selected-tags').isVisible()).toBe(true);
      expect(wrapper.find('.selected-tags .badge .close').isVisible()).toBe(true);
      expect(wrapper.find(`[data-qa="dropdown item ${selectedOption}"]`).exists()).toBe(false);
      expect(wrapper.find(`[data-qa="dropdown item ${testProps.fields[1]}"]`).exists()).toBe(true);
    });

    describe('and close tag is clicked', () => {
      it('updates the route with the clicked item removed from the selected options', async() => {
        const wrapper = factory(testProps, { $route: { query: { country: selectedOption } } });

        wrapper.find('.selected-tags .badge .close').trigger('click');

        expect(wrapper.vm.$router.push.calledWith({ query: { country: undefined, page: 1 } })).toBe(true);
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
