import { createLocalVue, mount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import TierToggler from '../../../../components/search/TierToggler.vue';

const localVue = createLocalVue();
const $route = {
  fullPath: '/search?view=grid&query=&page=1',
  query: {
    qf: ''
  }
};

localVue.use(BootstrapVue);

const factory = () => mount(TierToggler, {
  localVue,
  mocks: {
    $route,
    $t: () => {}
  }
});


describe('components/search/TierToggler', () => {
  it('changes active state when link is clicked', () => {
    const wrapper = factory();

    wrapper.setProps({ activeState: false });
    const tierToggle = wrapper.find('[data-qa="tier toggle"]');

    wrapper.vm.active.should.be.false;
    tierToggle.trigger('click');
    wrapper.vm.active.should.be.true;
    tierToggle.trigger('click');
    wrapper.vm.active.should.be.false;
  });
});
