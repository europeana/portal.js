import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import PrimaryCallToAction from '@/components/browse/PrimaryCallToAction.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = (propsData = { text: 'Call to action!', link: { text: 'I am the link', url: 'https://example.org/call-to-action' } }) => shallowMount(PrimaryCallToAction, {
  localVue,
  propsData
});

describe('components/browse/PrimaryCallToAction', () => {
  it('shows text', async() => {
    const wrapper = factory();

    const cta = wrapper.find('richtext-stub');

    expect(cta.vm.text).toBe('Call to action!');
  });

  it('shows the link with the text and no external link icon', async() => {
    const wrapper = factory();

    const cta = wrapper.find('smartlink-stub');
    expect(cta.text()).toBe('I am the link');
    expect(cta.vm.destination).toBe('https://example.org/call-to-action');
    expect(cta.vm.hideExternalIcon).toBe(true);
  });
});
