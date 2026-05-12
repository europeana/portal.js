import { mediaDownloadLabel } from './mediaDownloadLabel.js';

describe('mediaDownloadLabel', () => {
  it('uses the file extension for the media type', () => {
    const data = { ebucoreHasMimeType: 'image/jpeg' };

    const label = mediaDownloadLabel(data);

    expect(label).toBe('JPEG');
  });

  it('includes the file size if known', () => {
    const data = { ebucoreHasMimeType: 'image/jpeg', ebucoreFileByteSize: 1000 };

    const label = mediaDownloadLabel(data);

    expect(label).toBe('JPEG (1 kB)');
  });
});
