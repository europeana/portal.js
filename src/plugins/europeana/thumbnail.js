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

  const media = (uri, { size, type } = {}) => {
    const apiUrl = new URL(`${config.url || BASE_URL}/url.json`);

    apiUrl.searchParams.set('uri', uri);

    if (!size) {
      size = 200;
    }
    apiUrl.searchParams.set('size', (typeof size === 'number' ? `w${size}` : size));

    if (type) {
      apiUrl.searchParams.set('type', type);
    }

    return apiUrl.toString();
  };

  const generic = (itemId, { size, type } = {}) => {
    const uri = `${EUROPEANA_DATA_URL}/item${itemId}`;
    return media(uri, { size, type });
  };

  const edmPreview = (url, { size, type } = {}) => {
    if (!url) {
      return null;
    }

    const edmPreviewUrl = new URL(url);

    if (!size) {
      size = edmPreviewUrl.searchParams.get('size');
    }
    if (!type) {
      type = edmPreviewUrl.searchParams.get('type');
    }

    return media(edmPreviewUrl.searchParams.get('uri'), { size, type });
  };

  return {
    media,
    generic,
    edmPreview
  };
};
