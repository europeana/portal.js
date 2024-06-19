import { createLocalVue, shallowMount } from '@vue/test-utils';

import StoriesFeaturedCard from '@/components/stories/StoriesFeaturedCard.vue';

const localVue = createLocalVue();

const basePropsData = {
  featuredStory: {
    name: 'Story title',
    headline: 'Story headline',
    identifier: 'story-title',
    image: { url: 'https://www.example.com/image.jpg' }
  }
};

const factory = (propsData = basePropsData) => shallowMount(StoriesFeaturedCard, {
  localVue,
  propsData
});

describe('StoriesFeaturedCard.vue', () => {
  it('renders a component', () => {
    const wrapper = factory();
    expect(wrapper.find('[data-qa="featured story card"]').exists()).toBe(true);
  });
});
