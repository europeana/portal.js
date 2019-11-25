import { isPDF, isHTMLVideo, isHTMLAudio, isOEmbed, isRichMedia } from '../../../plugins/media';

describe('plugins/media', () => {
  describe('isPDF()', () => {
    it('returns `true` if mimeType is correct', () => {
      const mimeType = 'application/pdf';

      isPDF(mimeType).should.be.true;
    });
  });

  describe('isHTMLVideo()', () => {
    it('returns `true` if mimeType is correct', () => {
      const mimeType = ['video/ogg', 'video/webm', 'video/mp4'];

      for (const type of mimeType) {
        const codec = type === 'video/mp4' ? 'h264' : '';

        isHTMLVideo(type, codec).should.be.true;
      }
    });
  });

  describe('isHTMLAudio()', () => {
    it('returns `true` if mimeType is correct', () => {
      const mimeType = ['audio/flac', 'audio/ogg', 'audio/mp3'];

      for (const type of mimeType) {
        isHTMLAudio(type).should.be.true;
      }
    });
  });

  describe('isOEmbed()', () => {
    it('returns `true` if URL is correct', () => {
      const URL = 'https://soundcloud.com/oembed';

      isOEmbed(URL).should.be.true;
    });
  });

  describe('isRichMedia()', () => {
    it('returns `true` if correct parameters are present', () => {
      isRichMedia(undefined, undefined, 'https://soundcloud.com/oembed').should.be.true;
      isRichMedia('video/mp4', 'h264', undefined).should.be.true;
      isRichMedia('audio/mp3', undefined, undefined).should.be.true;
    });
  });
});
