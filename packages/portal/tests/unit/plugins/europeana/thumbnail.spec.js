import EuropeanaThumbnailApi, { LARGE_WIDTH, SMALL_WIDTH } from '@/plugins/europeana/thumbnail';

describe('plugins/europeana/thumbnail', () => {
  describe('LARGE_WIDTH', () => {
    it('is 400', () => {
      expect(LARGE_WIDTH).toBe(400);
    });
  });

  describe('SMALL_WIDTH', () => {
    it('is 200', () => {
      expect(SMALL_WIDTH).toBe(200);
    });
  });

  describe('EuropeanaThumbnailApi', () => {
    describe('baseURL', () => {
      it('defaults to the production thumbnail API', () => {
        expect((new EuropeanaThumbnailApi).baseURL).toBe('https://api.europeana.eu/thumbnail/v3');
      });

      describe('Thumbnail API v2', () => {
        const context = { $config: { europeana: { apis: { thumbnail: { url: 'https://api.europeana.eu/thumbnail/v2' } } } } };

        it('is not supported', () => {
          expect(() => (new EuropeanaThumbnailApi(context))).toThrow();
        });
      });
    });

    describe('media()', () => {
      const uri = 'https://www.example.org/doc.pdf';

      describe('Thumbnail API v3', () => {
        const context = { $config: { europeana: { apis: { thumbnail: { url: 'https://api.europeana.eu/thumbnail/v3' } } } } };

        describe('hash', () => {
          it('is used as-is when supplied', () => {
            const params = { hash: '123' };
            expect((new EuropeanaThumbnailApi(context)).media(uri, params).endsWith('/123')).toBe(true);
          });

          it('is generated from MD5 hash of URI when not supplied', () => {
            expect((new EuropeanaThumbnailApi(context)).media(uri).endsWith('/cffc370c6c63744ed934701a47b0349a')).toBe(true);
          });
        });

        describe('size', () => {
          it('is used as-is when supplied', () => {
            const params = { size: 400 };
            expect((new EuropeanaThumbnailApi(context)).media(uri, params).includes('/400/')).toBe(true);
          });

          it('defaults to 200 when not supplied', () => {
            expect((new EuropeanaThumbnailApi(context)).media(uri).includes('/200/')).toBe(true);
          });
        });
      });
    });

    describe('edmPreview()', () => {
      describe('for Thumbnail API v3 edm:preview URL', () => {
        describe('with v3 API URL in context', () => {
          const context = { $config: { europeana: { apis: { thumbnail: { url: 'https://api.europeana.eu/thumbnail/v3' } } } } };

          it('overwrites API URL using context', () => {
            const url = 'https://example.org/thumbnail/v3/200/cffc370c6c63744ed934701a47b0349a';

            const edmPreview = (new EuropeanaThumbnailApi(context)).edmPreview(url);

            expect(edmPreview).toBe('https://api.europeana.eu/thumbnail/v3/200/cffc370c6c63744ed934701a47b0349a');
          });

          it('favours requested size', () => {
            const url = 'https://example.org/thumbnail/v3/200/cffc370c6c63744ed934701a47b0349a';

            const edmPreview = (new EuropeanaThumbnailApi(context)).edmPreview(url, { size: 400 });

            expect(edmPreview).toBe('https://api.europeana.eu/thumbnail/v3/400/cffc370c6c63744ed934701a47b0349a');
          });
        });
      });

      it('is `null` if edmPreview is absent', () => {
        const edmPreview = (new EuropeanaThumbnailApi).edmPreview();

        expect(edmPreview).toBe(null);
      });
    });

    describe('forWebResource()', () => {
      describe('when web resource has a preview', () => {
        const webResource = { about: 'https://example.org/edmIsShownAt.html', preview: { about: 'https://example.org/edmObject.jpg' } };

        it('returns small/large thumbnail URLs for the preview', () => {
          const thumbnails = (new EuropeanaThumbnailApi).forWebResource(webResource);

          expect(thumbnails).toEqual({
            small: 'https://api.europeana.eu/thumbnail/v3/200/a397e91c3526e4d10197ae5690919e6c',
            large: 'https://api.europeana.eu/thumbnail/v3/400/a397e91c3526e4d10197ae5690919e6c'
          });
        });
      });

      describe('when web resource has no preview', () => {
        const webResource = { about: 'https://example.org/edmIsShownBy.jpeg' };

        it('returns small/large thumbnail URLs for the resource', () => {
          const thumbnails = (new EuropeanaThumbnailApi).forWebResource(webResource);

          expect(thumbnails).toEqual({
            small: 'https://api.europeana.eu/thumbnail/v3/200/8e1faf5bf6c3946cf6c49b50149de12a',
            large: 'https://api.europeana.eu/thumbnail/v3/400/8e1faf5bf6c3946cf6c49b50149de12a'
          });
        });
      });
    });
  });
});
