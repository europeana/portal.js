const CONTENTFUL_IMAGES_ASSET_HOST = 'images.ctfassets.net';
const CONTENTFUL_IMAGES_PARAMS_FL_PROGRESSIVE = 'progressive';
const CONTENTFUL_IMAGES_PARAMS_FM_WEBP = 'webp';
const CONTENTFUL_IMAGES_PARAMS_FM_JPEG = 'jpg';
const MEDIA_TYPE_JPEG = 'image/jpeg';
const MEDIA_TYPE_SVG = 'image/svg+xml';
const MEDIA_TYPE_WEBP = 'image/webp';

export default ({ store } = {}) => ({
  acceptedMediaTypes() {
    return store?.state?.contentful?.acceptedMediaTypes || [];
  },

  isValidUrl(url) {
    try {
      return (new URL(url)).host === CONTENTFUL_IMAGES_ASSET_HOST;
    } catch (e) {
      return false;
    }
  },

  optimisedSrc(asset, options = {}) {
    // TODO: use isValidUrl here?
    if (!asset?.url) {
      return null;
    }
    const imageUrl = new URL(asset.url);
    const params = { ...options };

    if (!params.fm && (asset.contentType !== MEDIA_TYPE_SVG) && this.acceptedMediaTypes().includes(MEDIA_TYPE_WEBP)) {
      params.fm = CONTENTFUL_IMAGES_PARAMS_FM_WEBP;
      if (!params.q) {
        params.q = 40;
      }
    } else if (asset.contentType === MEDIA_TYPE_JPEG) {
      params.fm = CONTENTFUL_IMAGES_PARAMS_FM_JPEG;
      params.fl = CONTENTFUL_IMAGES_PARAMS_FL_PROGRESSIVE;
      if (!params.q) {
        params.q = 80;
      }
    }

    for (const key in params)  {
      if (params[key]) {
        imageUrl.searchParams.set(key, params[key]);
      }
    }

    return imageUrl.toString();
  },

  responsiveImageSrcset(image, sizes) {
    if (this.isValidUrl(image?.url) && sizes) {
      return Object.keys(sizes)
        .map((size) => sizes[size] && `${this.optimisedSrc(image, sizes[size])} ${sizes[size].w}w`)
        .join(',');
    } else {
      return null;
    }
  },

  responsiveBackgroundImageCSSVars(image, sizes) {
    if (this.isValidUrl(image?.url) && sizes) {
      return Object.keys(sizes).reduce((memo, size) => {
        memo[`--bg-img-${size}`] = `url('${this.optimisedSrc(image, sizes[size])}')`;
        return memo;
      }, {});
    } else if (image?.url) {
      return {
        '--bg-img-small': `url('${image.url}')`
      };
    } else {
      return null;
    }
  }
});
