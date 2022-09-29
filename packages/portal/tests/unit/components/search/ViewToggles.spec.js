import { createLocalVue, mount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import VueRouter from 'vue-router';
import sinon from 'sinon';

import ViewToggles from '@/components/search/ViewToggles.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);
localVue.use(VueRouter);

const router = new VueRouter({
  routes: [
    {
      path: '/search',
      name: 'search'
    }
  ]
});

const factory = (propsData = {}) => {
  return mount(ViewToggles, {
    localVue,
    router,
    propsData,
    mocks: {
      $t: (key) => key,
      $path: (args) => args,
      $matomo: {
        trackEvent: sinon.spy()
      },
      $goto: sinon.spy()
    }
  });
};

describe('components/search/ViewToggles', () => {
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

        const viewToggleIcon = wrapper.find(`[data-qa="search ${view} view toggle"] + span.icon-view-toggle`);
        expect(viewToggleIcon.attributes('class')).toBe(`icon-view-toggle ${view}`);
      });
    });
  }

  describe('when the activeView changes', () => {
    it('redirects the page', async() => {
      const expectedGoToArgs = { name: null, meta: {}, path: '/', hash: '', query: { view: 'list' }, params: {}, fullPath: '/', matched: [] };

      const wrapper = factory({ value: 'grid' });

      await wrapper.setData({ activeView: 'list' });

      expect(wrapper.vm.$goto.calledWith(expectedGoToArgs)).toBe(true);
    });

    it('tracks the event in Matomo', async() => {
      const wrapper = factory({ value: 'grid' });

      await wrapper.setData({ activeView: 'list' });

      expect(wrapper.vm.$matomo.trackEvent.calledWith('View search results', 'Select view', 'list')).toBe(true);
    });
  });
});
