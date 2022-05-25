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

      expect(contentfulUtils.optimisedSrcForContentfulAsset(asset)).toBe('https://images.ctfassets.net/asset.jpeg?fm=jpg&fl=progressive');
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
});
