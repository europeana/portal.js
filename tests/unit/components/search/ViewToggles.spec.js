import { createLocalVue, mount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import VueRouter from 'vue-router';
import sinon from 'sinon';

import ViewToggles from '../../../../src/components/search/ViewToggles.vue';

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
      }
    }
  });
};

describe('components/search/ViewToggles', () => {
  for (const view of ['list', 'grid']) {
    describe(`${view} view`, () => {
      it('has a toggle', () => {
        const wrapper = factory();

        const viewToggle = wrapper.find(`[data-qa="search ${view} view toggle"]`);
        viewToggle.exists().should.eq(true);
      });

      it('links to route with view parameter set', () => {
        const wrapper = factory();

        const viewToggleLink = wrapper.find(`[data-qa="search ${view} view toggle"] a`);
        viewToggleLink.attributes('href').should.match(new RegExp(`[?&]view=${view}(&|$)`));
      });

      it('displays icon', () => {
        const wrapper = factory();

        const viewToggleIcon = wrapper.find(`[data-qa="search ${view} view toggle"] .icon-view-toggle`);
        viewToggleIcon.attributes('class').should.eq(`icon-view-toggle ${view}`);
      });
    });
  }

  describe('when v-model changes', () => {
    it('updates active view', () => {
      const wrapper = factory({ value: 'grid' });

      wrapper.setProps({ value: 'list' });

      wrapper.vm.activeView.should.eq('list');
    });

    it('tracks the event in Matomo', () => {
      const wrapper = factory({ value: 'grid' });

      wrapper.setProps({ value: 'list' });

      wrapper.vm.$matomo.trackEvent.should.have.been.calledWith('View search results', 'Select view', 'list');
    });
  });
});
