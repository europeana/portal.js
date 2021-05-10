import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import PaginationNav from '../../../../src/components/generic/PaginationNav.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = () => shallowMount(PaginationNav, {
  localVue
});

describe('components/generic/PaginationNav', () => {
  it('shows pagination for number of pages', () => {
    const wrapper = factory();
    wrapper.setProps({ totalResults: 240, perPage: 24 });

    wrapper.attributes().numberofpages.should.eq('10');
  });

  it('limits pagination to 1000 results', () => {
    const wrapper = factory();
    wrapper.setProps({ totalResults: 123456, perPage: 24 });

    wrapper.attributes().numberofpages.should.eq('42');
  });
});
