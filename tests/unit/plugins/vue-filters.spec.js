import Vue from 'vue';

require('@/plugins/vue-filters');

describe('Vue filters', () => {
  describe('optimisedImageUrl', () => {
    const optimisedImageUrl = Vue.filter('optimisedImageUrl');

    describe('when URL is for a Contentful asset', () => {
      describe('when content type is "image/jpeg"', () => {
        const imageUrl = '//images.ctfassets.net/image.jpg';
        const contentType = 'image/jpeg';

        it('appends JPEG optimisation parameters', () => {
          const optimised = optimisedImageUrl(imageUrl, contentType);
          expect(optimised.startsWith(imageUrl));
          expect(optimised.endsWith('?fm=jpg&fl=progressive&q=50'));
        });
      });

      describe('when content type is "image/png"', () => {
        const imageUrl = '//images.ctfassets.net/image.png';
        const contentType = 'image/png';

        it('returns URL as-is', () => {
          const optimised = optimisedImageUrl(imageUrl, contentType);
          expect(optimised).toBe(imageUrl);
        });
      });

      describe('when content type is "image/gif"', () => {
        const imageUrl = '//images.ctfassets.net/image.gif';
        const contentType = 'image/gif';

        it('returns URL as-is', () => {
          const optimised = optimisedImageUrl(imageUrl, contentType);
          expect(optimised).toBe(imageUrl);
        });
      });

      it('applies width and height options', () => {
        const imageUrl = '//images.ctfassets.net/image.png';
        const contentType = 'image/png';
        const options = { width: 200, height: 150 };

        const optimised = optimisedImageUrl(imageUrl, contentType, options);
        expect(optimised.startsWith(imageUrl));
        expect(optimised.endsWith(`?w=${options.width}&h=${options.height}`));
      });
    });

    describe('otherwise', () => {
      const imageUrl = 'http://www.example.org/image.jpg';

      it('returns URL as-is', () => {
        const optimised = optimisedImageUrl(imageUrl);
        expect(optimised).toBe(imageUrl);
      });
    });
  });

  describe('urlWithProtocol', () => {
    const urlWithProtocol = Vue.filter('urlWithProtocol');

    describe('when the URL begins with //', () => {
      it('prepends https:', () => {
        const url = '//example.org/';

        const withProtocol = urlWithProtocol(url);

        expect(withProtocol).toBe('https://example.org/');
      });
    });

    describe('when the URL begins with http:', () => {
      it('is returned as-is', () => {
        const url = 'http://example.org/';

        const withProtocol = urlWithProtocol(url);

        expect(withProtocol).toBe('http://example.org/');
      });
    });
  });
});
