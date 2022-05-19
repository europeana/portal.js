import * as contentfulUtils from '@/plugins/contentful-utils';

describe('plugins/contentful-utils', () => {
  describe('urlIsContentfulAsset', () => {
    it('is `true` for URLs on host images.ctfassets.net', () => {
      const src = '//images.ctfassets.net/asset.jpeg';

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
        url: '//images.ctfassets.net/asset.jpeg',
        contentType: 'image/jpeg'
      };

      expect(contentfulUtils.optimisedSrcForContentfulAsset(asset)).toBe('//images.ctfassets.net/asset.jpeg?fm=jpg&fl=progressive');
    });

    it('joins all the options', () => {
      const asset = {
        url: '//images.ctfassets.net/asset.jpeg',
        contentType: 'image/jpeg'
      };

      expect(contentfulUtils.optimisedSrcForContentfulAsset(asset, 200, 80)).toBe('//images.ctfassets.net/asset.jpeg?fm=jpg&fl=progressive&q=80&w=200');
    });

    it('applies passed max with', () => {
      const asset = {
        url: '//images.ctfassets.net/asset.png',
        contentType: 'image/png'
      };

      expect(contentfulUtils.optimisedSrcForContentfulAsset(asset, 40)).toBe('//images.ctfassets.net/asset.png?w=40');
    });
  });
});
