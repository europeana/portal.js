import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import TierToggler from '../../../../components/search/TierToggler.vue';

const localVue = createLocalVue();
const $route = {
  fullPath: '/search?view=grid&query=&page=1'
};

localVue.use(BootstrapVue);

const factory = () => shallowMount(TierToggler, {
  localVue,
  mocks: {
    $route,
    $t: () => {}
  }
});


describe('components/search/TierToggler', () => {
  const wrapper = factory();

  it('emits `click` event when selected', () => {
    wrapper.vm.toggleHandler();
    wrapper.emitted()['click'][0][0].should.eql('contentTier');
    wrapper.emitted()['click'][0][1][0].should.eql('*');
  });
});
