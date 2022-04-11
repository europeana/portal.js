import * as media from '@/plugins/media';

describe('plugins/media', () => {
  describe('isPDF()', () => {
    it('returns `true` if ebucoreHasMimeType is for PDF', () => {
      const ebucoreHasMimeType = 'application/pdf';

      expect(media.isPDF({ ebucoreHasMimeType })).toBe(true);
    });
  });

  describe('isImage()', () => {
    it('returns `true` if ebucoreHasMimeType is for an image', () => {
      const ebucoreHasMimeType = 'image/jpeg';

      expect(media.isImage({ ebucoreHasMimeType })).toBe(true);
    });
  });

  describe('isHTMLVideo()', () => {
    it('returns `true` if ebucoreHasMimeType is for HTML video', () => {
      const mediaTypes = ['video/ogg', 'video/webm', 'video/mp4'];

      for (const ebucoreHasMimeType of mediaTypes) {
        const edmCodecName = ebucoreHasMimeType === 'video/mp4' ? 'h264' : null;

        expect(media.isHTMLVideo({ ebucoreHasMimeType, edmCodecName })).toBe(true);
      }
    });
  });

  describe('isHTMLAudio()', () => {
    it('returns `true` if ebucoreHasMimeType is for HTML audio', () => {
      const mediaTypes = ['audio/flac', 'audio/ogg', 'audio/mpeg'];

      for (const ebucoreHasMimeType of mediaTypes) {
        expect(media.isHTMLAudio({ ebucoreHasMimeType })).toBe(true);
      }
    });
  });

  describe('isPlayableMedia()', () => {
    it('returns `true` if ebucoreHasMimeType is for video/mp4, video/ogg or video/webm', () => {
      const mediaTypes = ['video/mp4', 'video/ogg', 'video/webm'];
      const edmCodecName = 'h264';

      for (const ebucoreHasMimeType of mediaTypes) {
        expect(media.isPlayableMedia({ ebucoreHasMimeType, edmCodecName })).toBe(true);
      }
    });

    it('returns `false` if ebucoreHasMimeType is for video/somethingelse', () => {
      const mediaTypes = ['video/somethingelse'];

      for (const ebucoreHasMimeType of mediaTypes) {
        expect(media.isPlayableMedia({ ebucoreHasMimeType })).toBe(false);
      }
    });

    it('returns `true` if ebucoreHasMimeType is for audio/flac, audio/ogg or audio/mpeg', () => {
      const mediaTypes = ['audio/flac', 'audio/ogg', 'audio/mpeg'];

      for (const ebucoreHasMimeType of mediaTypes) {
        expect(media.isPlayableMedia({ ebucoreHasMimeType })).toBe(true);
      }
    });

    it('returns `false` if ebucoreHasMimeType is for audio/somethingelse', () => {
      const mediaTypes = ['audio/somethingelse'];

      for (const ebucoreHasMimeType of mediaTypes) {
        expect(media.isPlayableMedia({ ebucoreHasMimeType })).toBe(false);
      }
    });

    it('returns `true` if ebucoreHasMimeType is for application/dash+xml', () => {
      expect(media.isPlayableMedia({ ebucoreHasMimeType: 'application/dash+xml' })).toBe(true);
    });

    it('returns `true` if media.about is for EUscreen item', () => {
      expect(media.isPlayableMedia({ about: 'http://www.euscreen.eu/item.html?id=EUS_123' })).toBe(true);
    });

    it('returns `false` for other media types', () => {
      const mediaTypes = ['text/plain', 'image/jpeg', 'application/json'];

      for (const ebucoreHasMimeType of mediaTypes) {
        expect(media.isPlayableMedia({ ebucoreHasMimeType })).toBe(false);
      }
    });
  });

  describe('isOEmbed()', () => {
    it('returns `true` if URL is oEmbeddable', () => {
      const about = 'https://soundcloud.com/oembed';

      expect(media.isOEmbed({ about })).toBe(true);
    });
  });

  describe('isIIIFImage()', () => {
    it('returns `true` if item has IIIF Image service but no dctermsIsReferencedBy', () => {
      const item = {
        services: [
          {
            dctermsConformsTo: ['http://iiif.io/api/image']
          }
        ]
      };

      expect(media.isIIIFImage(item)).toBe(true);
    });
  });

  describe('isIIIFPresentation()', () => {
    it('returns `true` if item has IIIF Image service and a dctermsIsReferencedBy', () => {
      const item = {
        services: [
          {
            dctermsConformsTo: ['http://iiif.io/api/image']
          }
        ],
        dctermsIsReferencedBy: ['http://www.example.org/iiif/manifest']
      };

      expect(media.isIIIFPresentation(item)).toBe(true);
    });

    it('returns `false` if dctermsIsReferencedBy is Image info.json', () => {
      const item = {
        services: [
          {
            about: 'http://www.example.org/image',
            dctermsConformsTo: ['http://iiif.io/api/image']
          }
        ],
        dctermsIsReferencedBy: ['http://www.example.org/image/info.json']
      };

      expect(media.isIIIFPresentation(item)).toBe(false);
    });
  });

  describe('iiifManifest()', () => {
    const europeanaIdentifier = '/123/abc';

    describe('for a Presentation', () => {
      it('returns the first element in dctermsIsReferencedBy', () => {
        const manifest = 'http://www.example.org/iiif/manifest';
        const item = {
          services: [
            {
              dctermsConformsTo: ['http://iiif.io/api/image']
            }
          ],
          dctermsIsReferencedBy: [manifest]
        };

        expect(media.iiifManifest(item, europeanaIdentifier)).toBe(manifest);
      });
    });

    describe('for an Image', () => {
      it('uses the Europeana IIIF Presentation API', () => {
        const item = {
          services: [
            {
              dctermsConformsTo: ['http://iiif.io/api/image']
            }
          ]
        };

        expect(media.iiifManifest(item, europeanaIdentifier)).toBe(`https://iiif.europeana.eu/presentation${europeanaIdentifier}/manifest`);
      });
    });
  });

  describe('isRichMedia()', () => {
    it('returns `true` if media considered rich', () => {
      expect(media.isRichMedia({ about: 'https://soundcloud.com/oembed' })).toBe(true);
      expect(media.isRichMedia({ ebucoreHasMimeType: 'video/mp4', edmCodecName: 'h264' })).toBe(true);
      expect(media.isRichMedia({ ebucoreHasMimeType: 'audio/mpeg' })).toBe(true);
    });
  });

  describe('requiresDashJS()', () => {
    it('returns `true` if ebucoreHasMimeType is for Dash XML', () => {
      const ebucoreHasMimeType = 'application/dash+xml';

      expect(media.requiresDashJS(ebucoreHasMimeType)).toBe(true);
    });
  });
});
