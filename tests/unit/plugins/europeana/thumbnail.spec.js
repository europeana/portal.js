import thumbnailUrl, {
  thumbnailTypeForMimeType
} from '../../../../plugins/europeana/thumbnail';

describe('plugins/europeana/thumbnail', () => {
  describe('thumbnailUrl()', () => {
    const uri = 'https://www.example.org/doc.pdf';

    it('uses the thumbnail API', () => {
      thumbnailUrl(uri).should.startWith('https://api.europeana.eu/api/v2/thumbnail-by-url.json');
    });

    it('URL-encodes URI', () => {
      const encoded = 'https%3A%2F%2Fwww.example.org%2Fdoc.pdf';
      thumbnailUrl(uri).should.include(`uri=${encoded}`);
    });

    it('adds any additional parameters', () => {
      const params = { size: 'w200' };
      thumbnailUrl(uri, params).should.include('size=w200');
    });
  });

  describe('thumbnailTypeForMimeType()', () => {
    context('when MIME type starts with "image/"', () => {
      it('is "IMAGE"', () => {
        thumbnailTypeForMimeType('image/jpeg').should.eq('IMAGE');
      });
    });
    context('when MIME type starts with "audio/"', () => {
      it('is "SOUND"', () => {
        thumbnailTypeForMimeType('audio/ogg').should.eq('SOUND');
      });
    });
    context('when MIME type starts with "video/"', () => {
      it('is "VIDEO"', () => {
        thumbnailTypeForMimeType('video/mp4').should.eq('VIDEO');
      });
    });
    context('when MIME type starts with "text/"', () => {
      it('is "TEXT"', () => {
        thumbnailTypeForMimeType('text/plain').should.eq('TEXT');
      });
    });
    context('when MIME type is "application/pdf"', () => {
      it('is "TEXT"', () => {
        thumbnailTypeForMimeType('application/pdf').should.eq('TEXT');
      });
    });
    context('when MIME type is "application/rtf"', () => {
      it('is "TEXT"', () => {
        thumbnailTypeForMimeType('application/rtf').should.eq('TEXT');
      });
    });
    context('when MIME type is anything else', () => {
      it('is null', () => {
        (thumbnailTypeForMimeType('application/octet-stream') === null).should.be.true;
      });
    });
  });
});
