import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import VueRouter from 'vue-router';

import TierToggler from '../../../../components/search/TierToggler.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);
localVue.use(VueRouter);

const router = new VueRouter({
  routes: [
    {
      path: '/test',
      name: 'test'
    }
  ]
});

const factory = () => shallowMount(TierToggler, {
  localVue,
  router,
  propsData: {
    text: {
      show: 'Loerm ipsum show',
      hide: 'Lorem ipsum hide'
    },
    button: {
      show: 'show',
      hide: 'hide'
    }
  }
});

describe('components/search/TierToggler', () => {
  it('toggles on click', async () => {
    const wrapper = factory();
    const button = wrapper.find('[data-qa="tier toggler"]');

    wrapper.setData({
      toggle: false
    });
    button.trigger('click');
    wrapper.vm.toggle.should.eq(true);

    wrapper.setData({
      toggle: true
    });
    button.trigger('click');
    wrapper.vm.toggle.should.eq(false);
  });
});
