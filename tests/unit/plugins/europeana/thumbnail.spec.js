import thumbnail, {
  thumbnailTypeForMimeType
} from '@/plugins/europeana/thumbnail';

describe('plugins/europeana/thumbnail', () => {
  describe('default export', () => {
    describe('url()', () => {
      const uri = 'https://www.example.org/doc.pdf';

      it('defaults to the production thumbnail API', () => {
        expect(thumbnail().url(uri).startsWith('https://api.europeana.eu/thumbnail/v2/url.json')).toBe(true);
      });

      it('favours a thumbnail API in the describe', () => {
        const describe = { $config: { europeana: { apis: { thumbnail: { url: 'https://thumbnail.example.org' } } } } };

        expect(thumbnail(describe).url(uri).startsWith('https://thumbnail.example.org/url.json')).toBe(true);
      });

      it('URL-encodes URI', () => {
        const encoded = 'https%3A%2F%2Fwww.example.org%2Fdoc.pdf';
        expect(thumbnail().url(uri)).toContain(`uri=${encoded}`);
      });

      it('adds any additional parameters', () => {
        const params = { size: 'w200' };
        expect(thumbnail().url(uri, params)).toContain('size=w200');
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
      const size = 400;

      describe('when arg is a string', () => {
        it('uses it as edmPreview for URL', () => {
          const url = 'https://api.europeana.eu/thumbnail/v2/url.json?uri=https%3A%2F%2Fexample.org%2Fpreview.jpg';

          const edmPreview = thumbnail().edmPreview(url, size);

          expect(edmPreview).toBe('https://api.europeana.eu/thumbnail/v2/url.json?size=w400&uri=https%3A%2F%2Fexample.org%2Fpreview.jpg');
        });
      });

      describe('when edmPreview property is present on item', () => {
        it('uses edmPreview property for URL', () => {
          const item = {
            edmPreview: ['https://api.europeana.eu/thumbnail/v2/url.json?uri=https%3A%2F%2Fexample.org%2Fpreview.jpg'],
            type: 'VIDEO'
          };

          const edmPreview = thumbnail().edmPreview(item, size);

          expect(edmPreview).toBe('https://api.europeana.eu/thumbnail/v2/url.json?size=w400&type=VIDEO&uri=https%3A%2F%2Fexample.org%2Fpreview.jpg');
        });
      });

      describe('when edmPreview property is absent from item', () => {
        it('falls back to generic URL', () => {
          const item = {
            type: 'IMAGE',
            id: '/123/abc'
          };

          const edmPreview = thumbnail().edmPreview(item, size);

          expect(edmPreview).toBe('https://api.europeana.eu/thumbnail/v2/url.json?size=w400&type=IMAGE&uri=http%3A%2F%2Fdata.europeana.eu%2Fitem%2F123%2Fabc');
        });
      });

      describe('when size is not specified', () => {
        it('defaults to 200', () => {
          const url = 'https://api.europeana.eu/thumbnail/v2/url.json?uri=https%3A%2F%2Fexample.org%2Fpreview.jpg';

          const edmPreview = thumbnail().edmPreview(url);

          expect(edmPreview).toBe('https://api.europeana.eu/thumbnail/v2/url.json?size=w200&uri=https%3A%2F%2Fexample.org%2Fpreview.jpg');
        });
      });

      describe('when item is blank', () => {
        it('returns `null`', () => {
          const item = undefined;

          const edmPreview = thumbnail().edmPreview(item, size);

          expect(edmPreview).toBe(null);
        });
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
