import thumbnail, {
  thumbnailTypeForMimeType
} from '@/plugins/europeana/thumbnail';

describe('plugins/europeana/thumbnail', () => {
  describe('url()', () => {
    const uri = 'https://www.example.org/doc.pdf';

    it('defaults to the production thumbnail API', () => {
      thumbnail().url(uri).should.startWith('https://api.europeana.eu/thumbnail/v2/url.json');
    });

    it('favours a thumbnail API in the context', () => {
      const context = { $config: { europeana: { apis: { thumbnail: { url: 'https://thumbnail.example.org' } } } } };

      thumbnail(context).url(uri).should.startWith('https://thumbnail.example.org/url.json');
    });

    it('URL-encodes URI', () => {
      const encoded = 'https%3A%2F%2Fwww.example.org%2Fdoc.pdf';
      thumbnail().url(uri).should.include(`uri=${encoded}`);
    });

    it('adds any additional parameters', () => {
      const params = { size: 'w200' };
      thumbnail().url(uri, params).should.include('size=w200');
    });
  });

  describe('generic()', () => {
    it('uses the data.europeana.eu item URI', () => {
      const identifier = '/123/abc';
      const encodedUri = 'http%3A%2F%2Fdata.europeana.eu%2Fitem%2F123%2Fabc';
      thumbnail().generic(identifier).should.include(`uri=${encodedUri}`);
    });
  });

  describe('edmPreview()', () => {
    const size = 400;

    context('when edmPreview property is present on item', () => {
      it('uses edmPreview property for URL', () => {
        const item = {
          edmPreview: ['https://api.europeana.eu/thumbnail/v2/url.json?uri=https%3A%2F%2Fexample.org%2Fpreview.jpg'],
          type: 'VIDEO'
        };

        const edmPreview = thumbnail().edmPreview(item, size);

        edmPreview.should.eq('https://api.europeana.eu/thumbnail/v2/url.json?type=VIDEO&size=w400&uri=https%3A%2F%2Fexample.org%2Fpreview.jpg');
      });
    });

    context('when edmPreview property is absent from item', () => {
      it('falls back to generic URL', () => {
        const item = {
          type: 'IMAGE',
          id: '/123/abc'
        };

        const edmPreview = thumbnail().edmPreview(item, size);

        edmPreview.should.eq('https://api.europeana.eu/thumbnail/v2/url.json?type=IMAGE&size=w400&uri=http%3A%2F%2Fdata.europeana.eu%2Fitem%2F123%2Fabc');
      });
    });

    context('when item is blank', () => {
      it('returns `null`', () => {
        const item = undefined;

        const edmPreview = thumbnail().edmPreview(item, size);

        (edmPreview === null).should.be.true;
      });
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
    context('when MIME type is undefined', () => {
      it('is null', () => {
        (thumbnailTypeForMimeType(undefined) === null).should.be.true;
      });
    });
  });
});
