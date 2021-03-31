import { createLocalVue, mount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import VueRouter from 'vue-router';

import ViewToggles from '../../../../components/search/ViewToggles.vue';

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
      $path: (args) => args
    }
  });
};

describe('components/search/ViewToggles', () => {
  const views = ['list', 'grid'];

  for (const view of views) {
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

      it('changes active view when clicked', () => {
        const wrapper = factory();

        const viewToggle = wrapper.find(`[data-qa="search ${view} view toggle"] a`);
        viewToggle.trigger('click');

        wrapper.vm.activeView.should.eq(view);
      });
    });
  }

  it('updates active view when v-model changes', () => {
    const wrapper = factory({ value: 'grid' });

    wrapper.setProps({ value: 'list' });

    wrapper.vm.activeView.should.eq('list');
  });
});
