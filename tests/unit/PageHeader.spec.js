import { expect } from 'chai';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import PageHeader from '../../components/PageHeader.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = () => shallowMount(PageHeader, {
  localVue
});

describe('PageHeader', () => {
  it('contains a search form', () => {
    const wrapper = factory();

    expect(wrapper.html()).to.contain('form');
  });
});
