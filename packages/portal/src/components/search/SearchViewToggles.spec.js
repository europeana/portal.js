import { createLocalVue, mount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import sinon from 'sinon';

import SearchViewToggles from '@/components/search/SearchViewToggles.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = (propsData = {}) => {
  return mount(SearchViewToggles, {
    attachTo: document.body,
    localVue,
    propsData,
    mocks: {
      $t: (key) => key,
      localePath: (args) => args,
      $cookies: {
        set: sinon.spy()
      },
      $matomo: {
        trackEvent: sinon.spy()
      },
      $route: { query: {} }
    }
  });
};

describe('components/search/SearchViewToggles', () => {
  it('renders a dropdown', () => {
    const wrapper = factory();

    const viewToggle = wrapper.find('[data-qa="view toggle"]');
    expect(viewToggle.exists()).toBe(true);
  });

  it('displays the active view icon on the toggle button', () => {
    const wrapper = factory();

    const activeView = wrapper.vm.value;
    const viewToggleIcon = wrapper.find(`[data-qa="view toggle"] .icon-view-${activeView}`);
    expect(viewToggleIcon.exists()).toBe(true);
  });

  describe('When clicking a view option from the dropdown', () => {
    it('saves preference in a cookie and tracks the event in Matomo', () => {
      const wrapper = factory({ value: 'grid' });

      const viewOption = wrapper.find('[data-qa="mosaic view option"]');
      viewOption.trigger('click');

      expect(wrapper.vm.$cookies.set.calledWith('searchResultsView', 'mosaic')).toBe(true);
      expect(wrapper.vm.$matomo.trackEvent.calledWith('View search results', 'Select view', 'mosaic')).toBe(true);
    });

    it('sets showTooltip to false', () => {
      const wrapper = factory({ value: 'grid' });

      const viewOption = wrapper.find('[data-qa="mosaic view option"]');
      viewOption.trigger('click');

      expect(wrapper.vm.showTooltip).toEqual(false);
    });
  });

  describe('handleTooltipShow', () => {
    describe('when showTooltip is falsy', () => {
      const event = { preventDefault: sinon.spy() };

      it('prevents showing the tooltip and resets showTooltip', () => {
        const wrapper = factory();
        wrapper.vm.showTooltip = false;

        wrapper.vm.handleTooltipShow(event);

        expect(event.preventDefault.called).toBe(true);
        expect(wrapper.vm.showTooltip).toEqual(true);
      });
    });

    describe('when showTooltip is truthy', () => {
      const event = { preventDefault: sinon.spy() };

      it('prevents showing the tooltip and resets showTooltip', () => {
        const wrapper = factory();

        wrapper.vm.handleTooltipShow(event);

        expect(event.preventDefault.called).toBe(false);
        expect(wrapper.vm.showTooltip).toEqual(true);
      });
    });
  });
});
