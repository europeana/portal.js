/**
 * @file Functions for working with the Europeana Thumbnail API
 * @see https://pro.europeana.eu/page/record#thumbnails
 */

import md5 from 'md5';

export const BASE_URL = 'https://api.europeana.eu/thumbnail/v3';

// TODO: why does this get called multiple times on a single page load?
export default (context = {}) => {
  const baseUrl = context.store?.state?.apis?.urls?.thumbnail || BASE_URL;
  if (!baseUrl.endsWith('/v3')) {
    throw new Error('Only Thumbnail API v3 is supported for thumbnail URL generation.');
  }

  const media = (uri, { hash, size } = {}) => {
    if (!size) {
      size = 200;
    }

    if (!hash && uri) {
      hash = md5(uri);
    }
    return `${baseUrl}/${size}/${hash}`;
  };

  const edmPreview = (thumbnailApiUrl, { size } = {}) => {
    if (!thumbnailApiUrl) {
      return null;
    }

    const edmPreviewUrl = new URL(thumbnailApiUrl);

    // TODO: remove when v2 thumbnail URL conversion is no longer needed
    const v2 = () => {
      if (!size) {
        const sizeParam = edmPreviewUrl.searchParams.get('size');
        if (sizeParam) {
          size = sizeParam.replace('w', '');
        }
      }

      return media(edmPreviewUrl.searchParams.get('uri'), { size });
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
    edmPreview
  };
};
