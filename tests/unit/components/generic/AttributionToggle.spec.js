import { createLocalVue, shallowMount } from '@vue/test-utils';
import AttributionToggle from '@/components/generic/AttributionToggle.vue';
import BootstrapVue from 'bootstrap-vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const propsData = {
  attribution: {
    name: 'Something',
    creator: 'Someone',
    provider: 'Somewhere',
    rightsStatement: 'http://creativecommons.org/licenses/by-nd/4.0/',
    url: 'http://www.example.org/'
  }
};

const factory = () => shallowMount(AttributionToggle, {
  localVue,
  propsData
});

describe('components/generic/AttributionToggle', () => {
  it('toggles the rendering of the attribution', async() => {
    const wrapper = factory();
    wrapper.vm.toggleCite();
    await wrapper.vm.$nextTick();
    const attribution = wrapper.find('[data-qa="attribution"]');
    expect(attribution.exists()).toBe(true);
  });
});
