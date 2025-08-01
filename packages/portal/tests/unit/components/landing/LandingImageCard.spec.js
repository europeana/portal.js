import { createLocalVue, shallowMount } from '@vue/test-utils';

import LandingImageCard from '@/components/landing/LandingImageCard.vue';

const localVue = createLocalVue();

const SRCSET_PRESETS = {
  small: { w: 512, h: 342, fit: 'fill' },
  medium: { w: 510, h: 340, fit: 'fill' },
  large: { w: 690, h: 460, fit: 'fill' },
  xl: { w: 465, h: 310, fit: 'fill' },
  '4k': { w: 625, h: 417, fit: 'fill' },
  '4k+': { w: 1225, h: 700, fit: 'fill' }
}.toString();

const SIZES_PRESETS = [
  '(max-width: 575px) 512px', // bp-small
  '(max-width: 767px) 510px', // bp-medium
  '(max-width: 991px) 690px', // bp-large
  '(max-width: 1199px) 465px', // bp-xl
  '(max-width: 3019px) 625px', // bp-4k
  '1225px'
].join(',');

const SRCSET_PRESETS_DS4CH = {
  small: { w: 512, h: 342, fit: 'fill' },
  medium: { w: 510, h: 340, fit: 'fill' },
  large: { w: 690, h: 460, fit: 'fill' },
  xl: { w: 600, h: 400, fit: 'fill' },
  xxl: { w: 700, h: 467, fit: 'fill' },
  '4k': { w: 625, h: 417, fit: 'fill' },
  '4k+': { w: 1500, h: 1000, fit: 'fill' }
}.toString();

const SIZES_PRESETS_DS4CH = [
  '(max-width: 575px) 512px', // bp-small
  '(max-width: 767px) 510px', // bp-medium
  '(max-width: 991px) 690px', // bp-large
  '(max-width: 1199px) 600px', // bp-xl
  '(max-width: 1399px) 700px', // bp-xxl
  '(max-width: 3019px) 625px', // bp-4k
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

const ds4chTestPropsDataNoCropProfile = {
  ...ds4chTestPropsData,
  card: { ...ds4chTestPropsData.card,
    profile: {
      fit: 'pad',
      crop: false
    } }
};

const factory = (propsData = testPropsData) => shallowMount(LandingImageCard, {
  localVue,
  propsData,
  stubs: ['ImageWithAttribution']
});

describe('components/landing/LandingImageCard', () => {
  describe('when the variant is the default (pro)', () => {
    it('passes default image srcset and sizes', () => {
      const wrapper = factory();

      const imageWithAttribution = wrapper.find('imagewithattribution-stub');

      expect(imageWithAttribution.attributes('image-sizes')).toEqual(SIZES_PRESETS);
      expect(imageWithAttribution.attributes('contentful-image-crop-presets')).toEqual(SRCSET_PRESETS);
    });
  });

  describe('when the variant is ds4ch', () => {
    it('passes specific ds4ch image srcset and sizes', () => {
      const wrapper = factory(ds4chTestPropsData);

      const imageWithAttribution = wrapper.find('imagewithattribution-stub');

      expect(imageWithAttribution.attributes('image-sizes')).toEqual(SIZES_PRESETS_DS4CH);
      expect(imageWithAttribution.attributes('contentful-image-crop-presets')).toEqual(SRCSET_PRESETS_DS4CH);
    });
    describe('and there is a profile image with pad fit and no crop set', () => {
      it('passes specific ds4ch image srcset and sizes', () => {
        const wrapper = factory(ds4chTestPropsDataNoCropProfile);

        const imageWithAttribution = wrapper.find('imagewithattribution-stub');

        expect(imageWithAttribution.attributes('image-sizes')).toEqual(SIZES_PRESETS_DS4CH);
        expect(imageWithAttribution.attributes('contentful-image-crop-presets')).toEqual(SRCSET_PRESETS_DS4CH);
      });
    });
  });
});
