import { createLocalVue, shallowMount } from '@vue/test-utils';
import ImageWithAttribution from '@/components/image/ImageWithAttribution.vue';
import BootstrapVue from 'bootstrap-vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const propsData = {
  src: 'https://www.example.org/image.jpeg',
  attribution: {
    name: 'Something',
    creator: 'Someone',
    provider: 'Somewhere',
    rightsStatement: 'http://creativecommons.org/licenses/by-nd/4.0/',
    url: 'http://www.example.org/'
  }
};

const factory = () => shallowMount(ImageWithAttribution, {
  localVue,
  propsData
});

describe('components/image/ImageWithAttribution', () => {
  it('renders the image', () => {
    const wrapper = factory();
    const image = wrapper.find('figure [data-qa="image"]');
    expect(image.attributes().src).toBe(propsData.src);
  });
});
