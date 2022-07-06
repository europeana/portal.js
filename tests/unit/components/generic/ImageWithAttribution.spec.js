import { createLocalVue, shallowMount } from '@vue/test-utils';
import ImageWithAttribution from '@/components/generic/ImageWithAttribution.vue';
import BootstrapVue from 'bootstrap-vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const propsData = {
  src: 'https://www.example.org/image.jpeg'
};

const factory = () => shallowMount(ImageWithAttribution, {
  localVue,
  propsData
});

describe('components/generic/ImageWithAttribution', () => {
  it('renders the image', () => {
    const wrapper = factory();
    const image = wrapper.find('figure [data-qa="image"]');
    expect(image.attributes().src).toBe(propsData.src);
  });
});
