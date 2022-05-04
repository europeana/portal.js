import thumbnail, {
  thumbnailTypeForMimeType
} from '@/plugins/europeana/thumbnail';

describe('plugins/europeana/thumbnail', () => {
  describe('default export', () => {
    describe('media()', () => {
      const uri = 'https://www.example.org/doc.pdf';

      it('defaults to the v2 production thumbnail API', () => {
        expect(thumbnail().media(uri).startsWith('https://api.europeana.eu/thumbnail/v2/url.json')).toBe(true);
      });

      it('favours a thumbnail API in the context', () => {
        const context = { $config: { europeana: { apis: { thumbnail: { url: 'https://thumbnail.example.org' } } } } };

        expect(thumbnail(context).media(uri).startsWith('https://thumbnail.example.org/url.json')).toBe(true);
      });

      describe('Thumbnail API v2', () => {
        it('URL-encodes URI', () => {
          const encoded = 'https%3A%2F%2Fwww.example.org%2Fdoc.pdf';
          expect(thumbnail().media(uri)).toContain(`uri=${encoded}`);
        });

        it('adds any additional parameters', () => {
          const params = { size: 'w400' };
          expect(thumbnail().media(uri, params)).toContain('size=w400');
        });

        it('defaults size to 200', () => {
          expect(thumbnail().media(uri)).toContain('size=w200');
        });
      });

      describe('Thumbnail API v3', () => {
        const context = { $config: { europeana: { apis: { thumbnail: { url: 'https://api.europeana.eu/thumbnail/v3' } } } } };

        describe('hash', () => {
          it('is used as-is when supplied', () => {
            const params = { hash: '123' };
            expect(thumbnail(context).media(uri, params).endsWith('/123')).toBe(true);
          });

          it('is generated from MD5 hash of URI when not supplied', () => {
            expect(thumbnail(context).media(uri).endsWith('/cffc370c6c63744ed934701a47b0349a')).toBe(true);
          });
        });

        describe('size', () => {
          it('is used as-is when supplied', () => {
            const params = { size: 400 };
            expect(thumbnail(context).media(uri, params).includes('/400/')).toBe(true);
          });

          it('defaults to 200 when not supplied', () => {
            expect(thumbnail(context).media(uri).includes('/200/')).toBe(true);
          });
        });
      });
    });

    describe('generic()', () => {
      it('uses the data.europeana.eu item URI', () => {
        const identifier = '/123/abc';
        const encodedUri = 'http%3A%2F%2Fdata.europeana.eu%2Fitem%2F123%2Fabc';
        expect(thumbnail().generic(identifier)).toContain(`uri=${encodedUri}`);
      });
    });

    describe('edmPreview()', () => {
      describe('for Thumbnail API v2 edm:preview URL', () => {
        describe('with v2 API URL in context', () => {
          const context = { $config: { europeana: { apis: { thumbnail: { url: 'https://api.europeana.eu/thumbnail/v2' } } } } };

          it('overwrites API URL using context', () => {
            const url = 'https://example.org/thumbnail/v2/url.json?uri=https%3A%2F%2Fexample.org%2Fpreview.jpg';

            const edmPreview = thumbnail(context).edmPreview(url, { size: 400 });

            expect(edmPreview).toBe('https://api.europeana.eu/thumbnail/v2/url.json?uri=https%3A%2F%2Fexample.org%2Fpreview.jpg&size=w400');
          });

          describe('size', () => {
            it('favours value in options', () => {
              const url = 'https://api.europeana.eu/thumbnail/v2/url.json?uri=https%3A%2F%2Fexample.org%2Fpreview.jpg&size=w200';

              const edmPreview = thumbnail(context).edmPreview(url, { size: 400 });

              expect(edmPreview).toBe('https://api.europeana.eu/thumbnail/v2/url.json?uri=https%3A%2F%2Fexample.org%2Fpreview.jpg&size=w400');
            });

            it('falls back to value in URL query params', () => {
              const url = 'https://api.europeana.eu/thumbnail/v2/url.json?uri=https%3A%2F%2Fexample.org%2Fpreview.jpg&size=w400';

              const edmPreview = thumbnail(context).edmPreview(url);

              expect(edmPreview).toBe('https://api.europeana.eu/thumbnail/v2/url.json?uri=https%3A%2F%2Fexample.org%2Fpreview.jpg&size=w400');
            });

            it('defaults to 200', () => {
              const url = 'https://api.europeana.eu/thumbnail/v2/url.json?uri=https%3A%2F%2Fexample.org%2Fpreview.jpg';

              const edmPreview = thumbnail(context).edmPreview(url);

              expect(edmPreview).toBe('https://api.europeana.eu/thumbnail/v2/url.json?uri=https%3A%2F%2Fexample.org%2Fpreview.jpg&size=w200');
            });
          });

          describe('type', () => {
            it('favours value in options', () => {
              const url = 'https://api.europeana.eu/thumbnail/v2/url.json?uri=https%3A%2F%2Fexample.org%2Fpreview.jpg&type=VIDEO';

              const edmPreview = thumbnail(context).edmPreview(url, { type: 'IMAGE' });

              expect(edmPreview).toBe('https://api.europeana.eu/thumbnail/v2/url.json?uri=https%3A%2F%2Fexample.org%2Fpreview.jpg&size=w200&type=IMAGE');
            });

            it('falls back to value in URL query params', () => {
              const url = 'https://api.europeana.eu/thumbnail/v2/url.json?uri=https%3A%2F%2Fexample.org%2Fpreview.jpg&type=VIDEO';

              const edmPreview = thumbnail(context).edmPreview(url);

              expect(edmPreview).toBe('https://api.europeana.eu/thumbnail/v2/url.json?uri=https%3A%2F%2Fexample.org%2Fpreview.jpg&size=w200&type=VIDEO');
            });

            it('is omitted if absent', () => {
              const url = 'https://api.europeana.eu/thumbnail/v2/url.json?uri=https%3A%2F%2Fexample.org%2Fpreview.jpg';

              const edmPreview = thumbnail(context).edmPreview(url);

              expect(edmPreview).toBe('https://api.europeana.eu/thumbnail/v2/url.json?uri=https%3A%2F%2Fexample.org%2Fpreview.jpg&size=w200');
            });
          });
        });
      });

      describe('for Thumbnail API v3 edm:preview URL', () => {
        describe('with v2 API URL in context', () => {
          const context = { $config: { europeana: { apis: { thumbnail: { url: 'https://api.europeana.eu/thumbnail/v2' } } } } };

          it('returns `null` (because MD5 hash is non-decodable)', () => {
            const url = 'https://example.org/thumbnail/v3/200/cffc370c6c63744ed934701a47b0349a';

            const edmPreview = thumbnail(context).edmPreview(url);

            expect(edmPreview).toBe(null);
          });
        });

        describe('with v3 API URL in context', () => {
          const context = { $config: { europeana: { apis: { thumbnail: { url: 'https://api.europeana.eu/thumbnail/v3' } } } } };

          it('overwrites API URL using context', () => {
            const url = 'https://example.org/thumbnail/v3/200/cffc370c6c63744ed934701a47b0349a';

            const edmPreview = thumbnail(context).edmPreview(url);

            expect(edmPreview).toBe('https://api.europeana.eu/thumbnail/v3/200/cffc370c6c63744ed934701a47b0349a');
          });

          it('favours requested size', () => {
            const url = 'https://example.org/thumbnail/v3/200/cffc370c6c63744ed934701a47b0349a';

            const edmPreview = thumbnail(context).edmPreview(url, { size: 400 });

            expect(edmPreview).toBe('https://api.europeana.eu/thumbnail/v3/400/cffc370c6c63744ed934701a47b0349a');
          });
        });
      });

      it('is `null` if edmPreview is absent', () => {
        const edmPreview = thumbnail().edmPreview();

        expect(edmPreview).toBe(null);
      });
    });
  });

  describe('thumbnailTypeForMimeType()', () => {
    describe('when MIME type starts with "image/"', () => {
      it('is "IMAGE"', () => {
        expect(thumbnailTypeForMimeType('image/jpeg')).toBe('IMAGE');
      });
    });
    describe('when MIME type starts with "audio/"', () => {
      it('is "SOUND"', () => {
        expect(thumbnailTypeForMimeType('audio/ogg')).toBe('SOUND');
      });
    });
    describe('when MIME type starts with "video/"', () => {
      it('is "VIDEO"', () => {
        expect(thumbnailTypeForMimeType('video/mp4')).toBe('VIDEO');
      });
    });
    describe('when MIME type starts with "text/"', () => {
      it('is "TEXT"', () => {
        expect(thumbnailTypeForMimeType('text/plain')).toBe('TEXT');
      });
    });
    describe('when MIME type is "application/pdf"', () => {
      it('is "TEXT"', () => {
        expect(thumbnailTypeForMimeType('application/pdf')).toBe('TEXT');
      });
    });
    describe('when MIME type is "application/rtf"', () => {
      it('is "TEXT"', () => {
        expect(thumbnailTypeForMimeType('application/rtf')).toBe('TEXT');
      });
    });
    describe('when MIME type is anything else', () => {
      it('is null', () => {
        expect(thumbnailTypeForMimeType('application/octet-stream')).toBe(null);
      });
    });
    describe('when MIME type is undefined', () => {
      it('is null', () => {
        expect(thumbnailTypeForMimeType(undefined)).toBe(null);
      });
    });
  });
});
