import { createLocalVue, shallowMount } from '@vue/test-utils';
import TierToggler from '../../../../components/search/TierToggler.vue';

const localVue = createLocalVue();
const $route = {
  fullPath: '/search?view=grid&query=&page=1',
  query: {
    qf: ''
  }
};

const factory = () => shallowMount(TierToggler, {
  localVue,
  stubs: ['b-link'],
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
    tierToggle.vm.$emit('click');
    wrapper.vm.active.should.be.true;
    tierToggle.vm.$emit('click');
    wrapper.vm.active.should.be.false;
    wrapper.emitted()['changed'].length.should.equal(2);
  });
});
