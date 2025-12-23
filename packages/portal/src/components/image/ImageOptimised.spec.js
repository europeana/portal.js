import { createLocalVue, shallowMount } from '@vue/test-utils';
import ImageOptimised from '@/components/image/ImageOptimised.vue';
import sinon from 'sinon';

const localVue = createLocalVue();

const factory = (propsData) => shallowMount(ImageOptimised, {
  localVue,
  propsData
});

describe('components/image/ImageOptimised', () => {
  afterEach(sinon.resetHistory);

  describe('template', () => {
    it('uses a lazy loading image by default', () => {
      const wrapper = factory({
        src: 'https://www.example.org/image.jpeg',
        width: 2000,
        height: 1250
      });

      const lazyImage = wrapper.find('imageeagerorlazy-stub');

      expect(lazyImage.attributes('lazy')).toBe('true');
    });

    describe('when lazy is set to false', () => {
      it('uses a non-lazy loading image', () => {
        const wrapper = factory({
          src: 'https://www.example.org/image.jpeg',
          width: 2000,
          height: 1250,
          lazy: false
        });

        const image = wrapper.find('imageeagerorlazy-stub');

        expect(image.attributes('lazy')).toBeUndefined();
      });
    });

    describe('when image is contentful asset with image crop presets', () => {
      const src = 'https://images.ctfassets.net/asset';
      const contentfulImageCropPresets = {
        small: { w: 576, h: 896, fit: 'fill' },
        medium: { w: 768, h: 1080, fit: 'fill' }
      };
      const pictureSourceMediaResolutions = [1, 2];

      it('renders an image component for the first resolution, with responsive srcset', () => {
        const wrapper = factory({
          contentfulImageCropPresets,
          height: 1250,
          pictureSourceMediaResolutions,
          src,
          width: 2000
        });

        const img = wrapper.find('picture imageeagerorlazy-stub');

        expect(img.attributes('src')).toBe('https://images.ctfassets.net/asset?q=80&fm=webp');
        expect(img.attributes('srcset')).toBe('https://images.ctfassets.net/asset?w=576&h=896&fit=fill&q=80&fm=webp 576w,https://images.ctfassets.net/asset?w=768&h=1080&fit=fill&q=80&fm=webp 768w');
      });

      it('renders a source element for other resolutions, with responsive srcset', () => {
        const wrapper = factory({
          contentfulImageCropPresets,
          height: 1250,
          pictureSourceMediaResolutions,
          src,
          width: 2000
        });

        const source = wrapper.find('picture source');

        expect(source.attributes('srcset')).toBe('https://images.ctfassets.net/asset?w=1152&h=1792&fit=fill&q=80&fm=webp 1152w,https://images.ctfassets.net/asset?w=1536&h=2160&fit=fill&q=80&fm=webp 1536w');
        expect(source.attributes('media')).toBe('(resolution: 2x)');
      });
    });
  });

  describe('aspectRatio', () => {
    it('equals width / height', () => {
      const wrapper = factory({
        src: 'https://www.example.org/image.jpeg',
        width: 2000,
        height: 1250
      });

      const aspectRatio = wrapper.vm.aspectRatio;

      expect(aspectRatio).toBe(1.6);
    });
  });

  describe('optimisedWidth', () => {
    describe('with no maxWidth', () => {
      it('is unaltered image width', () => {
        const wrapper = factory({
          src: 'https://www.example.org/image.jpeg',
          width: 2000,
          height: 1250
        });

        const optimisedWidth = wrapper.vm.optimisedWidth;

        expect(optimisedWidth).toBe(2000);
      });
    });

    describe('when width is less than maxWidth', () => {
      it('is unaltered image width', () => {
        const wrapper = factory({
          src: 'https://www.example.org/image.jpeg',
          width: 2000,
          height: 1250,
          maxWidth: 2500
        });

        const optimisedWidth = wrapper.vm.optimisedWidth;

        expect(optimisedWidth).toBe(2000);
      });
    });

    describe('when width exceeds maxWidth', () => {
      it('is maxWidth', () => {
        const wrapper = factory({
          src: 'https://www.example.org/image.jpeg',
          width: 2000,
          height: 1250,
          maxWidth: 1500
        });

        const optimisedWidth = wrapper.vm.optimisedWidth;

        expect(optimisedWidth).toBe(1500);
      });
    });
  });

  describe('optimisedHeight', () => {
    it('is based on optimisedWidth, respecting aspect ratio', () => {
      const wrapper = factory({
        src: 'https://www.example.org/image.jpeg',
        width: 2000,
        height: 1250,
        maxWidth: 1500
      });

      const optimisedHeight = wrapper.vm.optimisedHeight;

      expect(optimisedHeight).toBe(938);
    });
  });

  describe('optimisedSrc', () => {
    describe('when src is not for Contentful image', () => {
      const src = 'https://www.example.org/image.jpeg';

      it('uses src unaltered', () => {
        const wrapper = factory({
          src,
          width: 2000,
          height: 1250
        });

        const optimisedSrc = wrapper.vm.optimisedSrc;

        expect(optimisedSrc).toBe(src);
      });
    });

    describe('when src is for Contentful image', () => {
      const src = 'https://images.ctfassets.net/asset';
      describe('and contentType is "image/jpeg"', () => {
        const contentType = 'image/jpeg';

        const propsData = {
          src,
          contentType,
          width: 2000,
          height: 1250,
          maxWidth: 1500
        };

        it('is optimised via Contentful Images API', () => {
          const wrapper = factory(propsData);

          const optimisedSrc = wrapper.vm.optimisedSrc;

          expect(optimisedSrc).toBe('https://images.ctfassets.net/asset?w=1500&q=80&fm=webp');
        });
      });
    });
  });
});
