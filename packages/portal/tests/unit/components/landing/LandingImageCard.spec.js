import { createLocalVue, shallowMount } from '@vue/test-utils';
// import sinon from 'sinon';

import LandingImageCard from '@/components/landing/LandingImageCard.vue';

const localVue = createLocalVue();

const SRCSET_PRESETS = {
  small: { w: 545, h: 270, fit: 'fill' },
  medium: { w: 510, h: 306, fit: 'fill' },
  large: { w: 510, h: 306, fit: 'fill' },
  xl: { w: 570, h: 342, fit: 'fill' },
  xxl: { w: 612, h: 367, fit: 'fill' },
  xxxl: { w: 612, h: 367, fit: 'fill' },
  wqhd: { w: 612, h: 367, fit: 'fill' },
  '4k': { w: 918, h: 551, fit: 'fill' }
}.toString();

const SIZES_PRESETS = [
  '(max-width: 575px) 545px', // bp-small
  '(max-width: 991px) 510px', // bp-large
  '(max-width: 1199px) 570px', // bp-xl
  '(max-width: 3019px) 612px', // bp-4k
  '918px'
].join(',');

const SRCSET_PRESETS_DS4CH = {
  small: { w: 512, fit: 'fill' },
  medium: { w: 510, fit: 'fill' },
  large: { w: 690, fit: 'fill' },
  xl: { w: 600, fit: 'fill' },
  xxl: { w: 700, fit: 'fill' },
  xxxl: { w: 940, fit: 'fill' },
  wqhd: { w: 1500, fit: 'fill' },
  '4k': { w: 1500, fit: 'fill' }
}.toString();

const SIZES_PRESETS_DS4CH = [
  '(max-width: 575px) 512px', // bp-small
  '(max-width: 767px) 510px', // bp-medium
  '(max-width: 991px) 690px', // bp-large
  '(max-width: 1199px) 600px', // bp-xl
  '(max-width: 1399px) 700px', // bp-xxl
  '(max-width: 1879px) 940px', // bp-xxxl
  '(max-width: 2519px) 1500px', // bp-wqhd
  '(max-width: 3019px) 1500px', // bp-4k
  '1500px'
].join(',');

const testPropsData = {
  card: {
    name: 'Title for an image card',
    image: {
      image: {
        url: 'https://www.example.eu/img.jpg',
        contentType: 'image/jpeg'
      }
    }
  }
};

const ds4chTestPropsData = {
  ...testPropsData,
  variant: 'ds4ch'
};

const factory = (propsData = testPropsData) => shallowMount(LandingImageCard, {
  localVue,
  propsData,
  mocks: {
    $contentful: {
      assets: {
        responsiveImageSrcset: (img, srcSet) => srcSet
      }
    }
  },
  stubs: ['ImageWithAttribution']
});

describe('components/landing/LandingImageCard', () => {
  describe('when the variant is the default (pro)', () => {
    it('passes default image srcset and sizes', () => {
      const wrapper = factory();

      const imageWithAttribution = wrapper.find('imagewithattribution-stub');

      expect(imageWithAttribution.attributes('image-sizes')).toEqual(SIZES_PRESETS);
      expect(imageWithAttribution.attributes('image-srcset')).toEqual(SRCSET_PRESETS);
    });
  });

  describe('when the variant is ds4ch', () => {
    it('passes specific ds4ch image srcset and sizes', () => {
      const wrapper = factory(ds4chTestPropsData);

      const imageWithAttribution = wrapper.find('imagewithattribution-stub');

      expect(imageWithAttribution.attributes('image-sizes')).toEqual(SIZES_PRESETS_DS4CH);
      expect(imageWithAttribution.attributes('image-srcset')).toEqual(SRCSET_PRESETS_DS4CH);
    });
  });
});
