import { createLocalVue, shallowMount } from '@vue/test-utils';
import OptimisedImage from '@/components/generic/OptimisedImage.vue';

const localVue = createLocalVue();

const factory = (propsData) => shallowMount(OptimisedImage, {
  localVue,
  propsData,
  stubs: ['b-img', 'b-img-lazy']
});

describe('components/generic/OptimisedImage', () => {
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

  describe('forContentfulAsset', () => {
    it('is `true` for URLs on host images.ctfassets.net', () => {
      const wrapper = factory({
        src: '//images.ctfassets.net/asset.jpeg',
        width: 2000,
        height: 1250
      });

      const forContentfulAsset = wrapper.vm.forContentfulAsset;

      expect(forContentfulAsset).toBe(true);
    });

    it('is `false` for other URLs', () => {
      const wrapper = factory({
        src: 'https://www.example.org/image.jpeg',
        width: 2000,
        height: 1250
      });

      const forContentfulAsset = wrapper.vm.forContentfulAsset;

      expect(forContentfulAsset).toBe(false);
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
      const src = '//images.ctfassets.net/asset';
      describe('and contentType is "image/jpeg"', () => {
        const contentType = 'image/jpeg';

        const propsData = {
          src,
          contentType,
          width: 2000,
          height: 1250,
          maxWidth: 1500
        };

        it('is a progressive JPEG', () => {
          const wrapper = factory(propsData);

          const optimisedSrc = wrapper.vm.optimisedSrc;

          expect(optimisedSrc).toContain('fm=jpg');
          expect(optimisedSrc).toContain('fl=progressive');
        });

        it('scales down to max width', () => {
          const wrapper = factory(propsData);

          const optimisedSrc = wrapper.vm.optimisedSrc;

          expect(optimisedSrc).toContain('w=1500');
        });

        it('reduces quality', () => {
          const wrapper = factory(propsData);

          const optimisedSrc = wrapper.vm.optimisedSrc;

          expect(optimisedSrc).toContain('q=80');
        });
      });
    });
  });
});
