/**
 * @file Functions for working with the Europeana Thumbnail API
 * @see https://pro.europeana.eu/resources/apis/record#thumbnails
 */

// TODO: remove this when the issue noted in the url plugin is resolved upstream
import { URL } from '../url';

export default function thumbnailUrl(uri, params = {}) {
  const url = new URL('https://api.europeana.eu/api/v2/thumbnail-by-url.json');
  for (const key of Object.keys(params)) {
    url.searchParams.set(key, params[key]);
  }
  url.searchParams.set('uri', uri);
  return url.toString();
}

export function thumbnailTypeForMimeType(mimeType) {
  if (typeof mimeType === 'undefined') return null;
  if (mimeType.startsWith('image/')) {
    return 'IMAGE';
  }
  if (mimeType.startsWith('audio/')) {
    return 'SOUND';
  }
  if (mimeType.startsWith('video/')) {
    return 'VIDEO';
  }
  if (mimeType.startsWith('text/') || ['application/pdf', 'application/rtf'].includes(mimeType)) {
    return 'TEXT';
  }
  return null;
}
