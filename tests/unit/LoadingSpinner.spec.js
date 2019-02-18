import { expect } from 'chai';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import LoadingSpinner from '../../components/LoadingSpinner.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = () => shallowMount(LoadingSpinner, {
  localVue
});

describe('LoadingSpinner', () => {
  it('is for the status', () => {
    const wrapper = factory();

    expect(wrapper.html()).to.contain('role="status"');
  });
});
