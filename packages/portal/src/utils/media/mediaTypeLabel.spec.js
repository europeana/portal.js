import { mediaTypeLabel } from './mediaTypeLabel.js';

describe('mediaTypeLabel', () => {
  describe('when media type is known to mime-types library', () => {
    const mediaType = 'image/jpeg';

    it('returns the recommended file extension, in uppercase', () => {
      const label = mediaTypeLabel(mediaType);

      expect(label).toBe('JPEG');
    });
  });

  describe('when media type is not known to mime-types library', () => {
    it('returns the subtype, in uppercase', () => {
      const mediaType = 'model/unknown';

      const label = mediaTypeLabel(mediaType);

      expect(label).toBe('UNKNOWN');
    });

    it('removes leading "x."', () => {
      const mediaType = 'model/x.unknown';

      const label = mediaTypeLabel(mediaType);

      expect(label).toBe('UNKNOWN');
    });

    it('removes leading "x-"', () => {
      const mediaType = 'model/x-unknown';

      const label = mediaTypeLabel(mediaType);

      expect(label).toBe('UNKNOWN');
    });
  });
});
