/**
 * @file Functions for working with the Europeana Thumbnail API
 * @see https://pro.europeana.eu/resources/apis/record#thumbnails
 */

// TODO: remove this when the issue noted in the url plugin is resolved upstream
import { URL } from '../url';
import config from './api';

export default function thumbnailUrl(uri, params = {}) {
  const url = new URL(`${config.origin}/api/v2/thumbnail-by-url.json`);
  for (const key of Object.keys(params)) {
    url.searchParams.set(key, params[key]);
  }
  url.searchParams.set('uri', uri);
  return url.toString();
}

export function thumbnailTypeForMimeType(mimeType) {
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
}
