import {
  thumbnailUrl, thumbnailTypeForMimeType, genericThumbnail
} from '@/plugins/europeana/thumbnail';

describe('plugins/europeana/thumbnail', () => {
  describe('thumbnailUrl()', () => {
    const uri = 'https://www.example.org/doc.pdf';

    it('uses the thumbnail API', () => {
      expect(thumbnailUrl(uri).startsWith('https://api.europeana.eu/thumbnail/v2/url.json')).toBe(true);
    });

    it('URL-encodes URI', () => {
      const encoded = 'https%3A%2F%2Fwww.example.org%2Fdoc.pdf';
      expect(thumbnailUrl(uri)).toContain(`uri=${encoded}`);
    });

    it('adds any additional parameters', () => {
      const params = { size: 'w200' };
      expect(thumbnailUrl(uri, params)).toContain('size=w200');
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
        expect(thumbnailTypeForMimeType('application/octet-stream') === null);
      });
    });
    describe('when MIME type is undefined', () => {
      it('is null', () => {
        expect(thumbnailTypeForMimeType(undefined) === null);
      });
    });
  });

  describe('genericThumbnail()', () => {
    it('uses the data.europeana.eu item URI', () => {
      const identifier = '/123/abc';
      const encodedUri = 'http%3A%2F%2Fdata.europeana.eu%2Fitem%2F123%2Fabc';
      expect(genericThumbnail(identifier)).toContain(`uri=${encodedUri}`);
    });
  });
});
