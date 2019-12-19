import * as media from '../../../plugins/media';

describe('plugins/media', () => {
  describe('isPDF()', () => {
    it('returns `true` if ebucoreHasMimeType is for PDF', () => {
      const ebucoreHasMimeType = 'application/pdf';

      media.isPDF({ ebucoreHasMimeType }).should.be.true;
    });
  });

  describe('isHTMLVideo()', () => {
    it('returns `true` if ebucoreHasMimeType is for HTML video', () => {
      const mediaTypes = ['video/ogg', 'video/webm', 'video/mp4'];

      for (const ebucoreHasMimeType of mediaTypes) {
        const edmCodecName = ebucoreHasMimeType === 'video/mp4' ? 'h264' : null;

        media.isHTMLVideo({ ebucoreHasMimeType, edmCodecName }).should.be.true;
      }
    });
  });

  describe('isHTMLAudio()', () => {
    it('returns `true` if ebucoreHasMimeType is for HTML audio', () => {
      const mediaTypes = ['audio/flac', 'audio/ogg', 'audio/mpeg'];

      for (const ebucoreHasMimeType of mediaTypes) {
        media.isHTMLAudio({ ebucoreHasMimeType }).should.be.true;
      }
    });
  });

  describe('isOEmbed()', () => {
    it('returns `true` if URL is oEmbeddable', () => {
      const about = 'https://soundcloud.com/oembed';

      media.isOEmbed({ about }).should.be.true;
    });
  });

  describe('isIIIFImage()', () => {
    it('returns `true` if item has IIIF Image service but no dctermsIsReferencedBy', () => {
      const item = {
        services: [{
          dctermsConformsTo: ['http://iiif.io/api/image']
        }]
      };

      media.isIIIFImage(item).should.be.true;
    });
  });

  describe('isIIIFPresentation()', () => {
    it('returns `true` if item has IIIF Image service and a dctermsIsReferencedBy', () => {
      const item = {
        services: [{
          dctermsConformsTo: ['http://iiif.io/api/image']
        }],
        dctermsIsReferencedBy: ['http://www.example.org/iiif/manifest']
      };

      media.isIIIFPresentation(item).should.be.true;
    });

    context('when `ssl` option is `true`', () => {
      it('returns `false` if manifest is http:// not https://', () => {
        const item = {
          services: [{
            dctermsConformsTo: ['http://iiif.io/api/image']
          }],
          dctermsIsReferencedBy: ['http://www.example.org/iiif/manifest']
        };

        media.isIIIFPresentation(item, { ssl: true }).should.be.false;
      });

      it('returns `true` if manifest is https:// not http://', () => {
        const item = {
          services: [{
            dctermsConformsTo: ['http://iiif.io/api/image']
          }],
          dctermsIsReferencedBy: ['https://www.example.org/iiif/manifest']
        };

        media.isIIIFPresentation(item, { ssl: true }).should.be.true;
      });
    });
  });

  describe('iiifManifest()', () => {
    it('returns the first element in dctermsIsReferencedBy', () => {
      const manifest = 'http://www.example.org/iiif/manifest';
      const item = {
        dctermsIsReferencedBy: [manifest]
      };

      media.iiifManifest(item).should.eq(manifest);
    });
  });

  describe('isRichMedia()', () => {
    it('returns `true` if media considered rich', () => {
      media.isRichMedia({ about: 'https://soundcloud.com/oembed' }).should.be.true;
      media.isRichMedia({ ebucoreHasMimeType: 'video/mp4', edmCodecName: 'h264' }).should.be.true;
      media.isRichMedia({ ebucoreHasMimeType: 'audio/mpeg' }).should.be.true;
    });
  });
});
