import {
  contentfulImageDisplayProfileResponsiveSizes,
  isContentfulAssetUrl,
  optimisedContentfulImageUrl,
  responsiveContentfulBackgroundImageCSSVars,
  responsiveContentfulImageSrcset
} from '@/utils/contentful/assets.js';

const responsiveParams = {
  small: { w: 245, h: 440, fit: 'fill' },
  medium: { w: 260, h: 420, fit: 'fill' },
  large: { w: 280, h: 400, fit: 'fill' },
  xl: { w: 300, h: 400, fit: 'fill' },
  xxl: { w: 320, h: 370, fit: 'fill' },
  xxxl: { w: 355, h: 345, fit: 'fill' },
  wqhd: { w: 510, h: 540, fit: 'fill' },
  '4k': { w: 700, h: 900, fit: 'fill' }
};

describe('@/utils/contentful/assets.js', () => {
  describe('isContentfulAssetUrl', () => {
    it('is `true` for URLs on host images.ctfassets.net', () => {
      const src = 'https://images.ctfassets.net/asset.jpeg';

      expect(isContentfulAssetUrl(src)).toBe(true);
    });

    it('is `false` for other URLs', () => {
      const src = 'https://www.example.org/image.jpeg';

      expect(isContentfulAssetUrl(src)).toBe(false);
    });

    it('is `false` for non-URLs', () => {
      const src = 'image.jpeg';

      expect(isContentfulAssetUrl(src)).toBe(false);
    });
  });

  describe('optimisedContentfulImageUrl', () => {
    it('is `null` if no asset passed', () => {
      expect(optimisedContentfulImageUrl(null)).toBe(null);
    });

    it('is `null` if asset has no URL', () => {
      expect(optimisedContentfulImageUrl({ contentType: 'image/jpeg' })).toBe(null);
    });

    it('respects format if specified', () => {
      const asset = {
        url: 'https://images.ctfassets.net/asset.gif',
        contentType: 'image/gif'
      };
      const params = { fm: 'png' };

      expect(optimisedContentfulImageUrl(asset, params)).toBe('https://images.ctfassets.net/asset.gif?fm=png');
    });

    it('converts to WebP if format not specified', () => {
      const asset = {
        url: 'https://images.ctfassets.net/asset.jpeg',
        contentType: 'image/jpeg'
      };

      expect(optimisedContentfulImageUrl(asset)).toBe('https://images.ctfassets.net/asset.jpeg?fm=webp&q=40');
    });

    it('respects supplied quality param for WebP', () => {
      const asset = {
        url: 'https://images.ctfassets.net/asset.jpeg',
        contentType: 'image/jpeg'
      };
      const params = { q: 50 };

      expect(optimisedContentfulImageUrl(asset, params)).toBe('https://images.ctfassets.net/asset.jpeg?q=50&fm=webp');
    });

    it('does not convert SVGs to WebP', () => {
      const asset = {
        url: 'https://images.ctfassets.net/asset.svg',
        contentType: 'image/svg+xml'
      };

      expect(optimisedContentfulImageUrl(asset)).toBe('https://images.ctfassets.net/asset.svg');
    });

    it('compresses jpegs', () => {
      const asset = {
        url: 'https://images.ctfassets.net/asset.jpeg',
        contentType: 'image/jpeg'
      };
      const params = { fm: 'jpg' };

      expect(optimisedContentfulImageUrl(asset, params)).toBe('https://images.ctfassets.net/asset.jpeg?fm=jpg&fl=progressive&q=80');
    });

    it('joins all the options', () => {
      const asset = {
        url: 'https://images.ctfassets.net/asset.jpeg',
        contentType: 'image/jpeg'
      };

      expect(optimisedContentfulImageUrl(asset, { w: 200, q: 80 })).toBe('https://images.ctfassets.net/asset.jpeg?w=200&q=80&fm=webp');
    });

    it('applies passed max width', () => {
      const asset = {
        url: 'https://images.ctfassets.net/asset.png',
        contentType: 'image/png'
      };

      expect(optimisedContentfulImageUrl(asset, { w: 40 })).toBe('https://images.ctfassets.net/asset.png?w=40&fm=webp&q=40');
    });
  });

  describe('contentfulImageDisplayProfileResponsiveSizes', () => {
    it('removes sizes if profile present and has them disabled', () => {
      const profile = {
        sizes: ['small']
      };

      const sizes = contentfulImageDisplayProfileResponsiveSizes(responsiveParams, profile);

      expect(sizes).toEqual({ small: responsiveParams.small });
    });

    it('removes height property if profile has fit: pad and crop: false', () => {
      const profile = {
        crop: false,
        fit: 'pad',
        sizes: ['small']
      };

      const sizes = { small: { w: 245, h: 440, fit: 'pad' } };
      const profileSizes = contentfulImageDisplayProfileResponsiveSizes(sizes, profile);

      expect(profileSizes).toEqual({ small: { w: 245, fit: 'pad' } });
    });
  });

  describe('responsiveContentfulImageSrcset', () => {
    describe('when a Contentful asset and params are available', () => {
      it('returns image srcset for all breakpoints', () => {
        const asset = {
          url: 'https://images.ctfassets.net/asset.jpeg',
          contentType: 'image/jpeg'
        };

        const srcset = responsiveContentfulImageSrcset(asset, responsiveParams);

        expect(srcset).toBe('https://images.ctfassets.net/asset.jpeg?w=245&h=440&fit=fill&fm=webp&q=40 245w,https://images.ctfassets.net/asset.jpeg?w=260&h=420&fit=fill&fm=webp&q=40 260w,https://images.ctfassets.net/asset.jpeg?w=280&h=400&fit=fill&fm=webp&q=40 280w,https://images.ctfassets.net/asset.jpeg?w=300&h=400&fit=fill&fm=webp&q=40 300w,https://images.ctfassets.net/asset.jpeg?w=320&h=370&fit=fill&fm=webp&q=40 320w,https://images.ctfassets.net/asset.jpeg?w=355&h=345&fit=fill&fm=webp&q=40 355w,https://images.ctfassets.net/asset.jpeg?w=510&h=540&fit=fill&fm=webp&q=40 510w,https://images.ctfassets.net/asset.jpeg?w=700&h=900&fit=fill&fm=webp&q=40 700w');
      });
    });

    describe('when a Contentful asset, but no params are available', () => {
      it('returns `null`', () => {
        const asset = {
          url: 'https://images.ctfassets.net/asset.jpeg',
          contentType: 'image/jpeg'
        };

        const srcset = responsiveContentfulImageSrcset(asset);

        expect(srcset).toBe(null);
      });
    });

    describe('when not a Contentful asset', () => {
      it('returns `null`', () => {
        const asset = 'image.jpeg';

        const srcset = responsiveContentfulImageSrcset(asset);

        expect(srcset).toBe(null);
      });
    });
  });

  describe('responsiveContentfulBackgroundImageCSSVars', () => {
    describe('when a Contentful asset and params are available', () => {
      it('returns style definitions for all breakpoints', () => {
        const asset = {
          url: 'https://images.ctfassets.net/asset.jpeg',
          contentType: 'image/jpeg'
        };

        const variables = responsiveContentfulBackgroundImageCSSVars(asset, responsiveParams);
        expect(variables['--bg-img-4k']).toBeTruthy();
      });
    });

    describe('when not a Contentful asset, but an image url is available', () => {
      it('returns style definitions for small breakpoint', () => {
        const asset = {
          url: 'https://www.europeana.eu/asset.jpeg'
        };

        const variables = responsiveContentfulBackgroundImageCSSVars(asset);
        expect(variables['--bg-img-small']).toBeTruthy();
        expect(variables['--bg-img-4k']).toBeFalsy();
      });
    });

    describe('when no image available', () => {
      it('returns null', () => {
        const asset = {};

        const variables = responsiveContentfulBackgroundImageCSSVars(asset);
        expect(variables).toBe(null);
      });
    });
  });
});
