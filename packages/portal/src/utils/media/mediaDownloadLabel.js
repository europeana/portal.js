import { filesize } from 'filesize';

import { mediaTypeLabel } from './mediaTypeLabel.js';

export const mediaDownloadLabel = (wr) => {
  let text = mediaTypeLabel(wr.ebucoreHasMimeType);
  if (wr.ebucoreFileByteSize) {
    text = `${text} (${filesize(wr.ebucoreFileByteSize)})`;
  }
  return text;
};
