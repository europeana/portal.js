import { createLocalVue, shallowMount } from '@vue/test-utils';
import sinon from 'sinon';

import LandingImageCard from '@/components/landing/LandingImageCard.vue';

const localVue = createLocalVue();

const factory = (propsData) => shallowMount(LandingImageCard, {
  localVue,
  propsData,
  mocks: {
    $contentful: {
      assets: {
        responsiveImageSrcset: sinon.spy()
      }
    }
  },
  stubs: ['b-container']
});

describe('components/landing/LandingImageCard', () => {
  it('uses responsive images', () => {
    const title = 'Title for an image card';
    const wrapper = factory({ card: { name: title,
      image: {
        image: {
          url: 'https://www.example.eu/img.jpg',
          contentType: 'image/jpeg'
        }
      } } });

    expect(wrapper.vm.$contentful.assets.responsiveImageSrcset.called).toBe(true);
  });
});
