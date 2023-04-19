import thumbnail from '@/plugins/europeana/thumbnail';

describe('plugins/europeana/thumbnail', () => {
  describe('default export', () => {
    describe('media()', () => {
      const uri = 'https://www.example.org/doc.pdf';

      it('defaults to the v3 production thumbnail API', () => {
        expect(thumbnail().media(uri).startsWith('https://api.europeana.eu/thumbnail/v3')).toBe(true);
      });

      it('favours a thumbnail API in the context', () => {
        const context = { $config: { europeana: { apis: { thumbnail: { url: 'https://thumbnail.example.org/thumbnail/v3' } } } } };

        expect(thumbnail(context).media(uri).startsWith('https://thumbnail.example.org/thumbnail/v3')).toBe(true);
      });

      describe('Thumbnail API v2', () => {
        const context = { $config: { europeana: { apis: { thumbnail: { url: 'https://api.europeana.eu/thumbnail/v2' } } } } };

        it('is not supported', () => {
          expect(() => {
            thumbnail(context).media(uri);
          }).toThrow();
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

    describe('edmPreview()', () => {
      describe('for Thumbnail API v2 edm:preview URL', () => {
        describe('with v3 API URL in context', () => {
          // const context = { $config: { europeana: { apis: { thumbnail: { url: 'https://api.europeana.eu/thumbnail/v3' } } } } };

          test.todo('spec this');
        });
      });

      describe('for Thumbnail API v3 edm:preview URL', () => {
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
});
