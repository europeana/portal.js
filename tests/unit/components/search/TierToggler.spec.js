import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import VueRouter from 'vue-router';

import TierToggler from '../../../../components/search/TierToggler.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);
localVue.use(VueRouter);

const factory = () => shallowMount(TierToggler, {
  localVue,
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

  it('emits `click` event when selected', () => {
    const wrapper = factory();
    const button = wrapper.find('[data-qa="tier toggler"]');

    button.trigger('click');
    wrapper.emitted()['click'][0][0].should.eql('contentTier');
  });
});
