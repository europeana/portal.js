import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import VueRouter from 'vue-router';

import TierToggler from '../../../../components/search/TierToggler.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);
localVue.use(VueRouter);

const factory = () => shallowMount(TierToggler, {
  localVue,
  mocks: {
    $t: () => {}
  }
});


describe('components/search/TierToggler', () => {
  const wrapper = factory();

  it('toggles on click', async () => {
    const button = wrapper.find('[data-qa="tier toggle button"]');

    wrapper.setData({
      active: false
    });
    button.trigger('click');
    wrapper.vm.active.should.eq(true);

    wrapper.setData({
      active: true
    });
    button.trigger('click');
    wrapper.vm.active.should.eq(false);
  });

  it('emits `click` event when selected', () => {
    const button = wrapper.find('[data-qa="tier toggle button"]');

    button.trigger('click');
    wrapper.emitted()['click'][0][0].should.eql('contentTier');
  });
});
