/**
 * @file Functions for working with the Europeana Thumbnail API
 * @see https://pro.europeana.eu/resources/apis/record#thumbnails
 */

import { BASE_URL as EUROPEANA_DATA_URL } from './data';

export const BASE_URL = process.env.EUROPEANA_THUMBNAIL_API_URL || 'https://api.europeana.eu/thumbnail/v2';

export const thumbnailUrl = (uri, params = {}) => {
  const url = new URL(`${BASE_URL}/url.json`);
  for (const key of Object.keys(params)) {
    url.searchParams.set(key, params[key]);
  }
  url.searchParams.set('uri', uri);
  return url.toString();
};

export const thumbnailTypeForMimeType = (mimeType) => {
  let thumbnailType = null;

  switch (true) {
    case typeof mimeType === 'undefined':
      break;
    case mimeType.startsWith('image/'):
      thumbnailType = 'IMAGE';
      break;
    case mimeType.startsWith('audio/'):
      thumbnailType = 'SOUND';
      break;
    case mimeType.startsWith('video/'):
      thumbnailType = 'VIDEO';
      break;
    case mimeType.startsWith('text/') || ['application/pdf', 'application/rtf'].includes(mimeType):
      thumbnailType = 'TEXT';
      break;
  }

  return thumbnailType;
};

export const genericThumbnail = (itemId, params = {}) => {
  const uri = `${EUROPEANA_DATA_URL}/item${itemId}`;
  return thumbnailUrl(uri, params);
};
