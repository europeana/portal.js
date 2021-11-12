/**
 * @file Functions for working with the Europeana Thumbnail API
 * @see https://pro.europeana.eu/resources/apis/record#thumbnails
 */

import { apiConfig } from './utils.js';
import { BASE_URL as EUROPEANA_DATA_URL } from './data.js';

export const BASE_URL = 'https://api.europeana.eu/thumbnail/v2';

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
    case mimeType.startsWith('text/'):
    case ['application/pdf', 'application/rtf'].includes(mimeType):
      thumbnailType = 'TEXT';
      break;
  }

  return thumbnailType;
};

export default (context = {}) => {
  const config = apiConfig(context.$config, 'thumbnail');

  const url = (uri, params = {}) => {
    const apiUrl = new URL(`${config.url || BASE_URL}/url.json`);
    for (const key of Object.keys(params)) {
      apiUrl.searchParams.set(key, params[key]);
    }
    apiUrl.searchParams.set('uri', uri);
    return apiUrl.toString();
  };

  const generic = (itemId, params = {}) => {
    const uri = `${EUROPEANA_DATA_URL}/item${itemId}`;
    return url(uri, params);
  };

  const edmPreview = (item, size = 200) => {
    if (!item) {
      return null;
    }

    const params = { type: item.type, size: `w${size}` };

    if (item.edmPreview) {
      const edmPreviewUrl = new URL(item.edmPreview[0]);
      return url(edmPreviewUrl.searchParams.get('uri'), params);
    } else {
      return generic(item.id, params);
    }
  };

  return {
    url,
    generic,
    edmPreview
  };
};
