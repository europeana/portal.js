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

    describe('.imageMegaPixels', () => {
      describe('when resource is not an image', () => {
        const ebucoreHasMimeType = 'video/mp4';

        it('is undefined', () => {
          const wr = new WebResource({ ebucoreHasMimeType });

          expect(wr.imageMegaPixels).toBeUndefined();
        });
      });

      describe('when resource is an image', () => {
        const ebucoreHasMimeType = 'image/jpeg';

        describe('but is missing height/width metadata', () => {
          it('is undefined', () => {
            const wr = new WebResource({ ebucoreHasMimeType });

            expect(wr.imageMegaPixels).toBeUndefined();
          });
        });

        describe('and has height/width metadata', () => {
          const ebucoreHeight = 1000;
          const ebucoreWidth = 1200;

          it('converts height/width to megapixels', () => {
            const wr = new WebResource({ ebucoreHasMimeType, ebucoreHeight, ebucoreWidth });

            expect(wr.imageMegaPixels).toBe(1.2);
          });
        });
      });
    });

    describe('.imageSize', () => {
      describe('when resource is not an image', () => {
        const ebucoreHasMimeType = 'video/mp4';

        it('is undefined', () => {
          const wr = new WebResource({ ebucoreHasMimeType });

          expect(wr.imageSize).toBeUndefined();
        });
      });

      describe('when resource is an image', () => {
        const ebucoreHasMimeType = 'image/jpeg';

        describe('but is missing height/width metadata', () => {
          it('is undefined', () => {
            const wr = new WebResource({ ebucoreHasMimeType });

            expect(wr.imageSize).toBeUndefined();
          });
        });

        describe('and has height/width metadata', () => {
          describe('of > 4 megapixels', () => {
            const ebucoreHeight = 2500;
            const ebucoreWidth = 2500;
            it('is "extra_large"', () => {
              const wr = new WebResource({ ebucoreHasMimeType, ebucoreHeight, ebucoreWidth });

              expect(wr.imageSize).toBe('extra_large');
            });
          });

          describe('of 1-4 megapixels', () => {
            const ebucoreHeight = 1000;
            const ebucoreWidth = 1200;
            it('is "large"', () => {
              const wr = new WebResource({ ebucoreHasMimeType, ebucoreHeight, ebucoreWidth });

              expect(wr.imageSize).toBe('large');
            });
          });

          describe('of 0.5-1 megapixels', () => {
            const ebucoreHeight = 800;
            const ebucoreWidth = 1200;
            it('is "medium"', () => {
              const wr = new WebResource({ ebucoreHasMimeType, ebucoreHeight, ebucoreWidth });

              expect(wr.imageSize).toBe('medium');
            });
          });

          describe('of < 0.5 megapixels', () => {
            const ebucoreHeight = 200;
            const ebucoreWidth = 300;
            it('is "small"', () => {
              const wr = new WebResource({ ebucoreHasMimeType, ebucoreHeight, ebucoreWidth });

              expect(wr.imageSize).toBe('small');
            });
          });
        });
      });
    });

    describe('.isHTMLImage', () => {
      const mediaTypes = ['image/bmp', 'image/gif', 'image/jpeg', 'image/png', 'image/svg+xml', 'image/webp'];

      for (const ebucoreHasMimeType of mediaTypes) {
        it(`is true if ebucoreHasMimeType is for HTML image type ${ebucoreHasMimeType}`, () => {
          const wr = new WebResource({ ebucoreHasMimeType });

          expect(wr.isHTMLImage).toBe(true);
        });
      }
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

    describe('.isPDF', () => {
      const ebucoreHasMimeType = 'application/pdf';
      it(`is true if ebucoreHasMimeType is for PDF type ${ebucoreHasMimeType}`, () => {
        const wr = new WebResource({ ebucoreHasMimeType });

        expect(wr.isPDF).toBe(true);
      });
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
        { about: 'http://www.euscreen.eu/item.html?id=EUS_123' },
        { about: 'https://www.euscreen.eu/item.html?id=EUS_123' }
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

    describe('.isEUScreenMedia', () => {
      it('is `true` if URL is http EUScreen URI', () => {
        const wr = new WebResource({ about: 'http://www.euscreen.eu/item.html?id=EUS_123' });

        expect(wr.isEUScreenMedia).toBe(true);
      });

      it('is `true` if URL is https EUScreen URI', () => {
        const wr = new WebResource({ about: 'https://www.euscreen.eu/item.html?id=EUS_123' });

        expect(wr.isEUScreenMedia).toBe(true);
      });

      it('is `false` for non EUScreen URIs', () => {
        const wr = new WebResource({ about: 'https://soundcloud.com/oembed' });

        expect(wr.isEUScreenMedia).toBe(false);
      });

      it('is `false` when there is no id present', () => {
        const wr = new WebResource({ ebucoreHasMimeType: 'image/jpeg' });

        expect(wr.isEUScreenMedia).toBe(false);
      });
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

    describe('.isIIIFPresentationManifest', () => {
      it('is `true` if rdfType starts with IIIF Presentation API URL', () => {
        const wr = new WebResource({ rdfType: 'http://iiif.io/api/presentation/3#Manifest' });

        expect(wr.isIIIFPresentationManifest).toBe(true);
      });
    });

    describe('.isDisplayableByIIIFPresentationManifest', () => {
      it('is `true` if media type displayable in IIIF viewer, and dctermsIsReferencedBy includes manifest', () => {
        const iiifPresentationManifest = 'https://iiif.example.org/manifest';
        const wr = new WebResource({
          dctermsIsReferencedBy: [iiifPresentationManifest],
          ebucoreHasMimeType: 'image/jpeg'
        });

        expect(wr.isDisplayableByIIIFPresentationManifest(iiifPresentationManifest)).toBe(true);
      });
    });
  });
});
