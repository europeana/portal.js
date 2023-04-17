import WebResource from '@/plugins/europeana/edm/WebResource';

describe('plugins/europeana/edm/WebResource', () => {
  describe('WebResource', () => {
    describe('.id', () => {
      it('is an alias for property `about`', () => {
        const edm = { about: '/123/abc' };
        const wr = new WebResource(edm);

        expect(wr.id).toBe(edm.about);
      });
    });

    describe('.edmType', () => {
      it('is IMAGE if ebucoreHasMimeType starts with image/', () => {
        const wr = new WebResource({ ebucoreHasMimeType: 'image/jpeg' });

        expect(wr.edmType).toBe('IMAGE');
      });

      it('is SOUND if ebucoreHasMimeType starts with audio/', () => {
        const wr = new WebResource({ ebucoreHasMimeType: 'audio/ogg' });

        expect(wr.edmType).toBe('SOUND');
      });

      it('is TEXT if ebucoreHasMimeType is for PDF', () => {
        const wr = new WebResource({ ebucoreHasMimeType: 'application/pdf' });

        expect(wr.edmType).toBe('TEXT');
      });

      it('is TEXT if ebucoreHasMimeType starts with text/', () => {
        const wr = new WebResource({ ebucoreHasMimeType: 'text/plain' });

        expect(wr.edmType).toBe('TEXT');
      });

      it('is VIDEO if ebucoreHasMimeType is for DASH', () => {
        const wr = new WebResource({ ebucoreHasMimeType: 'application/dash+xml' });

        expect(wr.edmType).toBe('VIDEO');
      });

      it('is VIDEO if ebucoreHasMimeType starts with video/', () => {
        const wr = new WebResource({ ebucoreHasMimeType: 'video/mp4' });

        expect(wr.edmType).toBe('VIDEO');
      });
    });

    describe('.isHTMLVideo', () => {
      const mediaTypes = ['video/ogg', 'video/webm', 'video/mp4'];

      for (const ebucoreHasMimeType of mediaTypes) {
        it(`is true if ebucoreHasMimeType is for HTML video type ${ebucoreHasMimeType}`, () => {
          const edmCodecName = ebucoreHasMimeType === 'video/mp4' ? 'h264' : null;
          const wr = new WebResource({ ebucoreHasMimeType, edmCodecName });

          expect(wr.isHTMLVideo).toBe(true);
        });
      }
    });

    describe('.isHTMLAudio', () => {
      const mediaTypes = ['audio/x-flac', 'audio/ogg', 'audio/mpeg'];

      for (const ebucoreHasMimeType of mediaTypes) {
        it(`is true if ebucoreHasMimeType is for HTML audio type ${ebucoreHasMimeType}`, () => {
          const wr = new WebResource({ ebucoreHasMimeType });

          expect(wr.isHTMLAudio).toBe(true);
        });
      }
    });

    describe('.isPlayableMedia', () => {
      const playableMedia = [
        { ebucoreHasMimeType: 'video/mp4', edmCodecName: 'h264' },
        { ebucoreHasMimeType: 'video/ogg' },
        { ebucoreHasMimeType: 'video/webm' },
        { ebucoreHasMimeType: 'audio/x-flac' },
        { ebucoreHasMimeType: 'audio/ogg' },
        { ebucoreHasMimeType: 'audio/mpeg' },
        { ebucoreHasMimeType: 'application/dash+xml' },
        { about: 'http://www.euscreen.eu/item.html?id=EUS_123' }
      ];
      const unplayableMedia = [
        { ebucoreHasMimeType: 'video/somethingelse' },
        { ebucoreHasMimeType: 'audio/somethingelse' },
        { ebucoreHasMimeType: 'text/plain' },
        { ebucoreHasMimeType: 'image/jpeg' },
        { ebucoreHasMimeType: 'application/json' }
      ];

      for (const media of playableMedia) {
        it(`is true for ${JSON.stringify(media)}`, () => {
          const wr = new WebResource(media);

          expect(wr.isPlayableMedia).toBe(true);
        });
      }

      for (const media of unplayableMedia) {
        it(`is false for ${JSON.stringify(media)}`, () => {
          const wr = new WebResource(media);

          expect(wr.isPlayableMedia).toBe(false);
        });
      }
    });

    describe('.isOEmbed', () => {
      it('is `true` if URL is oEmbeddable', () => {
        const wr = new WebResource({ about: 'https://soundcloud.com/oembed' });

        expect(wr.isOEmbed).toBe(true);
      });
    });

    describe('.isRichMedia', () => {
      const richMedia = [
        { about: 'https://soundcloud.com/oembed' },
        { ebucoreHasMimeType: 'video/mp4', edmCodecName: 'h264' },
        { ebucoreHasMimeType: 'audio/mpeg' }
      ];
      for (const media of richMedia) {
        it(`is true for ${JSON.stringify(media)}`, () => {
          const wr = new WebResource(media);

          expect(wr.isRichMedia).toBe(true);
        });
      }
    });

    describe('.requiresDashJS', () => {
      it('is `true` if ebucoreHasMimeType is for Dash XML', () => {
        const wr = new WebResource({ ebucoreHasMimeType: 'application/dash+xml' });

        expect(wr.requiresDashJS).toBe(true);
      });
    });
  });
});
