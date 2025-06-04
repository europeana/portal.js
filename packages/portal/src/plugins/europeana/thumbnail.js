import md5 from 'md5';

import EuropeanaApi from './apis/base.js';

export const LARGE_WIDTH = 400;
export const SMALL_WIDTH = 200;

export default class EuropeanaThumbnailApi extends EuropeanaApi {
  static ID = 'thumbnail';
  static BASE_URL = 'https://europeana-thumbnails-production.s3.eu-central-1.amazonaws.com';
  // https://europeana-thumbnails-production.s3.eu-central-1.amazonaws.com/0000058dc15eb0a6a4ac5eaa623decec-MEDIUM

  constructor(context) {
    super(context);
    if (!this.baseURL.endsWith('/v3')) {
      // throw new Error('Only Thumbnail API v3 is supported for thumbnail URL generation.');
    }
  }

  media(uri, { hash, size } = {}) {
    if (!size) {
      size = SMALL_WIDTH;
    }

    if (!hash && uri) {
      hash = md5(uri);
    }

    let sizeDesc = 'MEDIUM';
    if (size === LARGE_WIDTH) {
      sizeDesc = 'LARGE';
    }

    return `${this.baseURL}/${hash}-${sizeDesc}`;
  }

  edmPreview(thumbnailApiUrl, { size } = {}) {
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

      return this.media(edmPreviewUrl.searchParams.get('uri'), { size });
    };

    const v3 = () => {
      const sizeAndHash = edmPreviewUrl.pathname.slice(edmPreviewUrl.pathname.indexOf('/v3/') + 4).split('/');
      if (!size) {
        size = sizeAndHash[0];
      }
      const hash = sizeAndHash[1];
      return this.media(null, { hash, size });
    };

    return (edmPreviewUrl.pathname.includes('/v3/') ? v3() : v2());
  }

  forWebResource(webResource) {
    const uri = webResource.preview?.about || webResource.about;
    return {
      small: this.media(uri, { size: SMALL_WIDTH }),
      large: this.media(uri, { size: LARGE_WIDTH })
    };
  }
}
