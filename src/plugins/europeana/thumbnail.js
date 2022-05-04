/**
 * @file Functions for working with the Europeana Thumbnail API
 * @see https://pro.europeana.eu/page/record#thumbnails
 */

import md5 from 'md5';

import { apiConfig } from './utils.js';
import { BASE_URL as EUROPEANA_DATA_URL } from './data.js';

// TODO: switch to v3 when v2 support is deprecated
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
  const baseUrl = config.url || BASE_URL;

  // TODO: remove `type` when v2 support is deprecated
  const media = (uri, { hash, size, type } = {}) => {
    if (!size) {
      size = 200;
    }

    // TODO: remove when v2 support is deprecated
    const v2 = () => {
      if (!uri) {
        return null;
      }

      const apiUrl = new URL(`${baseUrl}/url.json`);

      apiUrl.searchParams.set('uri', uri);

      apiUrl.searchParams.set('size', (`${size}`.startsWith('w') ? size : `w${size}`));

      if (type) {
        apiUrl.searchParams.set('type', type);
      }

      return apiUrl.toString();
    };

    const v3 = () => {
      if (!hash && uri) {
        hash = md5(uri);
      }
      return `${baseUrl}/${size}/${hash}`;
    };

    return baseUrl.endsWith('/v3') ? v3() : v2();
  };

  // TODO: remove when v2 support is deprecated
  const generic = (itemId, { size, type } = {}) => {
    const uri = `${EUROPEANA_DATA_URL}/item${itemId}`;
    return media(uri, { size, type });
  };

  // TODO: remove `type` when v2 support is deprecated
  const edmPreview = (thumbnailApiUrl, { size, type } = {}) => {
    if (!thumbnailApiUrl) {
      return null;
    }

    const edmPreviewUrl = new URL(thumbnailApiUrl);

    // TODO: remove when v2 support is deprecated
    const v2 = () => {
      if (!size) {
        const sizeParam = edmPreviewUrl.searchParams.get('size');
        if (sizeParam) {
          size = sizeParam.replace('w', '');
        }
      }
      if (!type) {
        type = edmPreviewUrl.searchParams.get('type');
      }

      return media(edmPreviewUrl.searchParams.get('uri'), { size, type });
    };

    const v3 = () => {
      const sizeAndHash = edmPreviewUrl.pathname.slice(edmPreviewUrl.pathname.indexOf('/v3/') + 4).split('/');
      if (!size) {
        size = sizeAndHash[0];
      }
      const hash = sizeAndHash[1];
      return media(null, { hash, size });
    };

    return (edmPreviewUrl.pathname.includes('/v3/') ? v3() : v2());
  };

  return {
    media,
    generic,
    edmPreview
  };
};
