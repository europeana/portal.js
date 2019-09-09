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

  it('displays a toggle for each view', () => {
    const wrapper = factory();

    for (const view of views) {
      const viewToggle = wrapper.find(`[data-qa="search ${view} view toggle"]`);
      viewToggle.exists().should.eq(true);
    }
  });

  it('links to search with view parameter set', () => {
    const wrapper = factory();

    const viewToggleLink = wrapper.find('[data-qa="search list view toggle"] a');

    viewToggleLink.attributes('href').should.contain('view=list');
  });

  it('displays icon', () => {
    const wrapper = factory();

    const viewToggleIcon = wrapper.find('[data-qa="search grid view toggle"] img');

    viewToggleIcon.attributes('src').should.match(/\/grid\.([^/]+\.)?svg$/);
  });

  it('emits `changed` event when selected', async() => {
    const wrapper = factory();

    const viewToggle = wrapper.find('[data-qa="search list view toggle"] img');
    viewToggle.trigger('click');

    wrapper.emitted()['changed'][0][0].should.eql('list');
  });
});
