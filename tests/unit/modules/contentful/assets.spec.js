import assets from '@/modules/contentful/templates/assets';

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

describe('modules/contentful/templates/assets', () => {
  describe('isValidUrl', () => {
    it('is `true` for URLs on host images.ctfassets.net', () => {
      const src = 'https://images.ctfassets.net/asset.jpeg';

      expect(assets().isValidUrl(src)).toBe(true);
    });

    it('is `false` for other URLs', () => {
      const src = 'https://www.example.org/image.jpeg';

      expect(assets().isValidUrl(src)).toBe(false);
    });

    it('is `false` for non-URLs', () => {
      const src = 'image.jpeg';

      expect(assets().isValidUrl(src)).toBe(false);
    });
  });

  describe('optimisedSrc', () => {
    it('is `null` if no asset passed', () => {
      expect(assets().optimisedSrc(null)).toBe(null);
    });

    it('is `null` if asset has no URL', () => {
      expect(assets().optimisedSrc({ contentType: 'image/jpeg' })).toBe(null);
    });

    describe('if WebP format accepted by client', () => {
      const store = { state: { contentful: { acceptedMediaTypes: ['text/html', 'image/apng', 'image/webp'] } } };

      it('respects format if specified', () => {
        const asset = {
          url: 'https://images.ctfassets.net/asset.gif',
          contentType: 'image/gif'
        };
        const params = { fm: 'png' };

        expect(assets({ store }).optimisedSrc(asset, params)).toBe('https://images.ctfassets.net/asset.gif?fm=png');
      });

      it('converts to WebP if format not specified', () => {
        const asset = {
          url: 'https://images.ctfassets.net/asset.jpeg',
          contentType: 'image/jpeg'
        };

        expect(assets({ store }).optimisedSrc(asset)).toBe('https://images.ctfassets.net/asset.jpeg?fm=webp&q=40');
      });

      it('respects supplied quality param for WebP', () => {
        const asset = {
          url: 'https://images.ctfassets.net/asset.jpeg',
          contentType: 'image/jpeg'
        };
        const params = { q: 50 };

        expect(assets({ store }).optimisedSrc(asset, params)).toBe('https://images.ctfassets.net/asset.jpeg?q=50&fm=webp');
      });

      it('does not convert SVGs to WebP', () => {
        const asset = {
          url: 'https://images.ctfassets.net/asset.svg',
          contentType: 'image/svg+xml'
        };

        expect(assets({ store }).optimisedSrc(asset)).toBe('https://images.ctfassets.net/asset.svg');
      });
    });

    it('compresses jpegs', () => {
      const asset = {
        url: 'https://images.ctfassets.net/asset.jpeg',
        contentType: 'image/jpeg'
      };

      expect(assets().optimisedSrc(asset)).toBe('https://images.ctfassets.net/asset.jpeg?fm=jpg&fl=progressive&q=80');
    });

    it('joins all the options', () => {
      const asset = {
        url: 'https://images.ctfassets.net/asset.jpeg',
        contentType: 'image/jpeg'
      };

      expect(assets().optimisedSrc(asset, { w: 200, q: 80 })).toBe('https://images.ctfassets.net/asset.jpeg?w=200&q=80&fm=jpg&fl=progressive');
    });

    it('applies passed max width', () => {
      const asset = {
        url: 'https://images.ctfassets.net/asset.png',
        contentType: 'image/png'
      };

      expect(assets().optimisedSrc(asset, { w: 40 })).toBe('https://images.ctfassets.net/asset.png?w=40');
    });
  });

  describe('responsiveImageSrcset', () => {
    describe('when a Contentful asset and params are available', () => {
      it('returns image srcset for all breakpoints', () => {
        const asset = {
          url: 'https://images.ctfassets.net/asset.jpeg',
          contentType: 'image/jpeg'
        };

        const srcset = assets().responsiveImageSrcset(asset, responsiveParams);
        expect(srcset).toContain('https://images.ctfassets.net/asset.jpeg?w=245&h=440&fit=fill&fm=jpg&fl=progressive&q=80 245w');
      });
    });

    describe('when a Contentful asset, but no params are available', () => {
      it('returns `null`', () => {
        const asset = {
          url: 'https://images.ctfassets.net/asset.jpeg',
          contentType: 'image/jpeg'
        };

        const srcset = assets().responsiveImageSrcset(asset);

        expect(srcset).toBe(null);
      });
    });

    describe('when not a Contentful asset', () => {
      it('returns `null`', () => {
        const asset = 'image.jpeg';

        const srcset = assets().responsiveImageSrcset(asset);

        expect(srcset).toBe(null);
      });
    });
  });

  describe('responsiveBackgroundImageCSSVars', () => {
    describe('when a Contentful asset and params are available', () => {
      it('returns style definitions for all breakpoints', () => {
        const asset = {
          url: 'https://images.ctfassets.net/asset.jpeg',
          contentType: 'image/jpeg'
        };

        const variables = assets().responsiveBackgroundImageCSSVars(asset, responsiveParams);
        expect(variables['--bg-img-4k']).toBeTruthy();
      });
    });

    describe('when not a Contentful asset, but an image url is available', () => {
      it('returns style definitions for small breakpoint', () => {
        const asset = {
          url: 'https://www.europeana.eu/asset.jpeg'
        };

        const variables = assets().responsiveBackgroundImageCSSVars(asset);
        expect(variables['--bg-img-small']).toBeTruthy();
        expect(variables['--bg-img-4k']).toBeFalsy();
      });
    });

    describe('when no image available', () => {
      it('returns null', () => {
        const asset = {};

        const variables = assets().responsiveBackgroundImageCSSVars(asset);
        expect(variables).toBe(null);
      });
    });
  });
});
