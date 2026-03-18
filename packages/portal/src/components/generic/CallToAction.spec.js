import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import CallToAction from '@/components/generic/CallToAction.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = (propsData = { text: 'Call to action!', url: 'https://example.org/call-to-action' }) => shallowMount(CallToAction, {
  localVue,
  propsData
});

describe('components/generic/CallToAction', () => {
  it('shows the text', async() => {
    const wrapper = factory();

    expect(wrapper.text()).toBe('Call to action!');
  });
});
