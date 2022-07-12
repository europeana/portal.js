import * as contentfulUtils from '@/plugins/contentful-utils';

describe('plugins/contentful-utils', () => {
  describe('urlIsContentfulAsset', () => {
    it('is `true` for URLs on host images.ctfassets.net', () => {
      const src = 'https://images.ctfassets.net/asset.jpeg';

      expect(contentfulUtils.urlIsContentfulAsset(src)).toBe(true);
    });

    it('is `false` for other URLs', () => {
      const src = 'https://www.example.org/image.jpeg';

      expect(contentfulUtils.urlIsContentfulAsset(src)).toBe(false);
    });
  });

  describe('optimisedSrcForContentfulAsset', () => {
    it('compresses jpegs', () => {
      const asset = {
        url: 'https://images.ctfassets.net/asset.jpeg',
        contentType: 'image/jpeg'
      };

      expect(contentfulUtils.optimisedSrcForContentfulAsset(asset)).toBe('https://images.ctfassets.net/asset.jpeg?fm=jpg&fl=progressive&q=80');
    });

    it('joins all the options', () => {
      const asset = {
        url: 'https://images.ctfassets.net/asset.jpeg',
        contentType: 'image/jpeg'
      };

      expect(contentfulUtils.optimisedSrcForContentfulAsset(asset, { w: 200, q: 80 })).toBe('https://images.ctfassets.net/asset.jpeg?w=200&q=80&fm=jpg&fl=progressive');
    });

    it('applies passed max width', () => {
      const asset = {
        url: 'https://images.ctfassets.net/asset.png',
        contentType: 'image/png'
      };

      expect(contentfulUtils.optimisedSrcForContentfulAsset(asset, { w: 40 })).toBe('https://images.ctfassets.net/asset.png?w=40');
    });
  });

  describe('responsiveBackgroundImageCSSVars', () => {
    describe('when a Contentful asset and params are available', () => {
      it('returns style definitions for all breakpoints', () => {
        const asset = {
          url: 'https://images.ctfassets.net/asset.jpeg',
          contentType: 'image/jpeg'
        };
        const params =
          { small: { w: 245, h: 440, fit: 'fill' },
            medium: { w: 260, h: 420, fit: 'fill' },
            large: { w: 280, h: 400, fit: 'fill' },
            xl: { w: 300, h: 400, fit: 'fill' },
            xxl: { w: 320, h: 370, fit: 'fill' },
            xxxl: { w: 355, h: 345, fit: 'fill' },
            wqhd: { w: 510, h: 540, fit: 'fill' },
            '4k': { w: 700, h: 900, fit: 'fill' } };

        const variables = contentfulUtils.responsiveBackgroundImageCSSVars(asset, params);
        expect(variables['--bg-img-4k']).toBeTruthy();
      });
    });

    describe('when not a Contentful asset, but an image url is available', () => {
      it('returns style definitions for small breakpoint', () => {
        const asset = {
          url: 'https://www.europeana.eu/asset.jpeg'
        };

        const variables = contentfulUtils.responsiveBackgroundImageCSSVars(asset);
        expect(variables['--bg-img-small']).toBeTruthy();
        expect(variables['--bg-img-4k']).toBeFalsy();
      });
    });

    describe('when no image available', () => {
      it('returns null', () => {
        const asset = {};

        const variables = contentfulUtils.responsiveBackgroundImageCSSVars(asset);
        expect(variables).toBe(null);
      });
    });
  });
});
