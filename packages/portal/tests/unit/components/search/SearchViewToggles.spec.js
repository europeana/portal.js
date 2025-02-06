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
      $matomo: {
        trackEvent: sinon.spy()
      },
      $route: { query: {} },
      $router: { push: sinon.spy() }
    }
  });
};

describe('components/search/SearchViewToggles', () => {
  for (const view of ['list', 'grid', 'mosaic']) {
    describe(`${view} view`, () => {
      it('has a toggle', () => {
        const wrapper = factory();

        const viewToggle = wrapper.find(`[data-qa="search ${view} view toggle"]`);
        expect(viewToggle.exists()).toBe(true);
      });

      it('has a radio button with a value of the view', () => {
        const wrapper = factory();

        const viewToggleLink = wrapper.find(`[data-qa="search ${view} view toggle"]`);
        expect(viewToggleLink.attributes('value')).toMatch(view);
      });

      it('displays icon', () => {
        const wrapper = factory();

        const viewToggleIcon = wrapper.find(`[data-qa="search ${view} view toggle icon"]`);
        expect(viewToggleIcon.attributes('class')).toBe(`icon-view-toggle ${view}`);
      });
    });
  }

  describe('when the activeView changes', () => {
    it('redirects the page', async() => {
      const expectedGoToArgs = { query: { view: 'list' } };
      const wrapper = factory({ value: 'grid' });

      await wrapper.setData({ activeView: 'list' });

      expect(wrapper.vm.$router.push.calledWith(expectedGoToArgs)).toBe(true);
    });

    it('tracks the event in Matomo', async() => {
      const wrapper = factory({ value: 'grid' });

      await wrapper.setData({ activeView: 'list' });

      expect(wrapper.vm.$matomo.trackEvent.calledWith('View search results', 'Select view', 'list')).toBe(true);
    });
  });
});
