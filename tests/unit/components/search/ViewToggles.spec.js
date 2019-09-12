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

const factory = () => mount(ViewToggles, {
  localVue,
  router,
  mocks: {
    $t: (key) => key,
    localePath: (opts) => opts
  }
});

describe('components/search/ViewToggles', () => {
  const views = ['list', 'grid'];

  for (const view of views) {
    describe(`${view} view`, () => {
      it('has a toggle', () => {
        const wrapper = factory();

        const viewToggle = wrapper.find(`[data-qa="search ${view} view toggle"]`);
        viewToggle.exists().should.eq(true);
      });

      // TODO: why does this fail? href in tests is just e.g. "?view=list" without
      //       the route path.
      it('links to route with view parameter set', () => {
        const wrapper = factory();

        const viewToggleLink = wrapper.find(`[data-qa="search ${view} view toggle"] a`);
        viewToggleLink.attributes('href').should.contain(`/search?view=${view}`);
      });

      it('displays icon', () => {
        const wrapper = factory();

        const viewToggleIcon = wrapper.find(`[data-qa="search ${view} view toggle"] img`);

        const regexp = new RegExp(`/${view}.([^/]+.)?svg$`);
        viewToggleIcon.attributes('src').should.match(regexp);
      });

      it('emits `changed` event when selected', () => {
        const wrapper = factory();

        const viewToggle = wrapper.find(`[data-qa="search ${view} view toggle"] img`);
        viewToggle.trigger('click');

        wrapper.emitted()['changed'][0][0].should.eql(view);
      });
    });
  }
});
