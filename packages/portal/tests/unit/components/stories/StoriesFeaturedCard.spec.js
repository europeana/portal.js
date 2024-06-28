import sinon from 'sinon';
import { createLocalVue, mount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';

import StoriesFeaturedCard from '@/components/stories/StoriesFeaturedCard.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const basePropsData = {
  featuredStory: {
    name: 'Story title',
    headline: 'Story headline',
    identifier: 'story-title',
    primaryImageOfPage: {
      image: { url: 'https://www.example.com/primaryImageOfPage.jpg' }
    }
  }
};

const factory = (propsData = basePropsData) => mount(StoriesFeaturedCard, {
  localVue,
  propsData,
  mocks: {
    $contentful: {
      assets: {
        isValidUrl: (url) => url.includes('images.ctfassets.net'),
        optimisedSrc: sinon.spy((img) => `${img.url}?optimised`)
      }
    }
  }
});

describe('StoriesFeaturedCard.vue', () => {
  it('renders a component', () => {
    const wrapper = factory();
    expect(wrapper.find('[data-qa="featured story card"]').exists()).toBe(true);
  });

  it('uses the primary image of the story page', () => {
    const wrapper = factory();

    const cardImage = wrapper.find('img');
    expect(cardImage.attributes('src')).toBe('https://www.example.com/primaryImageOfPage.jpg');
  });
});
