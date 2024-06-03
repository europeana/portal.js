import { createLocalVue, shallowMount } from '@vue/test-utils';
import sinon from 'sinon';

import LandingIllustrationGroup from '@/components/landing/LandingIllustrationGroup.vue';

const localVue = createLocalVue();

const factory = (propsData) => shallowMount(LandingIllustrationGroup, {
  localVue,
  propsData,
  mocks: {
    $contentful: {
      assets: {
        responsiveContentfulImageSrcset: sinon.spy((img) => `${img.url}?optimised`)
      }
    }
  },
  stubs: ['b-container', 'b-col']
});

describe('components/landing/LandingIllustrationGroup', () => {
  it('displays a title', () => {
    const title = 'Title for an illustration group';
    const wrapper = factory({ title });

    const titleElement = wrapper.find('h2');

    expect(titleElement.text()).toBe(title);
  });

  it('passes a srcset for responsive images', () => {
    const illustrations = [{ image: { url: 'https://images.ctfassets.net/example.png', width: 100, height: 100 } }];
    const wrapper = factory({ illustrations });

    const imageStub = wrapper.find('imageoptimised-stub');

    expect(imageStub.attributes('imagesrcset')).toBe(`${illustrations[0].image.url}?optimised`);
  });
});
