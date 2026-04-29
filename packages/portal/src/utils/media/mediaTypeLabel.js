import { extension as mediaTypeFileExtension } from 'mime-types';

export const mediaTypeLabel = (mediaType) => {
  if (typeof mediaType !== 'string') {
    return undefined;
  }

  let label = mediaTypeFileExtension(mediaType);

  if (!label) {
    // extract e.g. "stl-ascii" from "model/x.stl-ascii"
    label = mediaType.split('/')[1]?.replace(/^x[-.]/, '');
  }

  return label?.toUpperCase();
};
