import Vue from 'vue';

require('../../../plugins/vue-filters');

describe('Vue filters', () => {
  describe('optimisedImageUrl', () => {
    const optimisedImageUrl = Vue.filter('optimisedImageUrl');

    context('when URL is for a Contentful asset', () => {
      context('when content type is "image/jpeg"', () => {
        const imageUrl = '//images.ctfassets.net/image.jpg';
        const contentType = 'image/jpeg';

        it('appends JPEG optimisation parameters', () => {
          const optimised = optimisedImageUrl(imageUrl, contentType);
          optimised.should.startWith(imageUrl);
          optimised.should.endWith('?fm=jpg&fl=progressive&q=50');
        });
      });

      context('when content type is "image/png"', () => {
        const imageUrl = '//images.ctfassets.net/image.png';
        const contentType = 'image/png';

        it('returns URL as-is', () => {
          const optimised = optimisedImageUrl(imageUrl, contentType);
          optimised.should.eq(imageUrl);
        });
      });

      context('when content type is "image/gif"', () => {
        const imageUrl = '//images.ctfassets.net/image.gif';
        const contentType = 'image/gif';

        it('returns URL as-is', () => {
          const optimised = optimisedImageUrl(imageUrl, contentType);
          optimised.should.eq(imageUrl);
        });
      });
    });

    context('otherwise', () => {
      const imageUrl = 'http://www.example.org/image.jpg';

      it('returns URL as-is', () => {
        const optimised = optimisedImageUrl(imageUrl);
        optimised.should.eq(imageUrl);
      });
    });
  });

  describe('proxyMedia', () => {
    const proxyMedia = Vue.filter('proxyMedia');
    const europeanaId = '/123/abc';
    const mediaUrl = 'https://www.example.org/audio.ogg';

    it('returns media proxy URL for item web resource', () => {
      const expected = `https://proxy.europeana.eu${europeanaId}?` +
        new URLSearchParams({ url: mediaUrl }).toString();

      const proxyUrl = proxyMedia(mediaUrl, europeanaId);

      proxyUrl.should.eq(expected);
    });
  });
});
