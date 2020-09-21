import thumbnail from '../../../../plugins/europeana/thumbnail';

describe('plugins/europeana/thumbnail', () => {
  describe('thumbnail().thumbnailUrl()', () => {
    const uri = 'https://www.example.org/doc.pdf';

    it('uses the thumbnail API', () => {
      thumbnail().thumbnailUrl(uri).should.startWith('https://api.europeana.eu/thumbnail/v2/url.json');
    });

    it('URL-encodes URI', () => {
      const encoded = 'https%3A%2F%2Fwww.example.org%2Fdoc.pdf';
      thumbnail().thumbnailUrl(uri).should.include(`uri=${encoded}`);
    });

    it('adds any additional parameters', () => {
      const params = { size: 'w200' };
      thumbnail().thumbnailUrl(uri, params).should.include('size=w200');
    });
  });

  describe('thumbnail().thumbnailTypeForMimeType()', () => {
    context('when MIME type starts with "image/"', () => {
      it('is "IMAGE"', () => {
        thumbnail().thumbnailTypeForMimeType('image/jpeg').should.eq('IMAGE');
      });
    });
    context('when MIME type starts with "audio/"', () => {
      it('is "SOUND"', () => {
        thumbnail().thumbnailTypeForMimeType('audio/ogg').should.eq('SOUND');
      });
    });
    context('when MIME type starts with "video/"', () => {
      it('is "VIDEO"', () => {
        thumbnail().thumbnailTypeForMimeType('video/mp4').should.eq('VIDEO');
      });
    });
    context('when MIME type starts with "text/"', () => {
      it('is "TEXT"', () => {
        thumbnail().thumbnailTypeForMimeType('text/plain').should.eq('TEXT');
      });
    });
    context('when MIME type is "application/pdf"', () => {
      it('is "TEXT"', () => {
        thumbnail().thumbnailTypeForMimeType('application/pdf').should.eq('TEXT');
      });
    });
    context('when MIME type is "application/rtf"', () => {
      it('is "TEXT"', () => {
        thumbnail().thumbnailTypeForMimeType('application/rtf').should.eq('TEXT');
      });
    });
    context('when MIME type is anything else', () => {
      it('is null', () => {
        (thumbnail().thumbnailTypeForMimeType('application/octet-stream') === null).should.be.true;
      });
    });
    context('when MIME type is undefined', () => {
      it('is null', () => {
        (thumbnail().thumbnailTypeForMimeType(undefined) === null).should.be.true;
      });
    });
  });

  describe('thumbnail().genericThumbnail()', () => {
    it('uses the data.europeana.eu item URI', () => {
      const identifier = '/123/abc';
      const encodedUri = 'http%3A%2F%2Fdata.europeana.eu%2Fitem%2F123%2Fabc';
      thumbnail().genericThumbnail(identifier).should.include(`uri=${encodedUri}`);
    });
  });
});
