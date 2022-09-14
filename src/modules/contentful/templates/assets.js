const MEDIA_TYPE_JPEG = 'image/jpeg';
const MEDIA_TYPE_SVG = 'image/svg+xml';
const MEDIA_TYPE_WEBP = 'image/webp';

export default ({ store } = {}) => ({
  acceptedMediaTypes() {
    return store?.state?.contentful?.acceptedMediaTypes || [];
  },

  isValidUrl(url) {
    try {
      return (new URL(url)).host === 'images.ctfassets.net';
    } catch (e) {
      return false;
    }
  },

  optimisedSrc(asset, params = {}) {
    // TODO: use isValidUrl here?
    if (!asset?.url) {
      return null;
    }
    const imageUrl = new URL(asset.url);

    if (!params.fm && (asset.contentType !== MEDIA_TYPE_SVG) && this.acceptedMediaTypes().includes(MEDIA_TYPE_WEBP)) {
      params.fm = 'webp';
      if (!params.q) {
        params.q = 40;
      }
    } else if (asset.contentType === MEDIA_TYPE_JPEG) {
      params.fm = 'jpg';
      params.fl = 'progressive';
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

  responsiveImageSrcset(image, params) {
    if (this.isValidUrl(image?.url) && params) {
      return [
        `${this.optimisedSrc(image, params.small)} ${params.small.w}w`,
        `${this.optimisedSrc(image, params.medium)} ${params.medium.w}w`,
        `${this.optimisedSrc(image, params.large)} ${params.large.w}w`,
        `${this.optimisedSrc(image, params.xl)} ${params.xl.w}w`,
        `${this.optimisedSrc(image, params.xxl)} ${params.xxl.w}w`,
        `${this.optimisedSrc(image, params.xxxl)} ${params.xxxl.w}w`,
        `${this.optimisedSrc(image, params.wqhd)} ${params.wqhd.w}w`,
        `${this.optimisedSrc(image, params['4k'])} ${params['4k'].w}w`
      ].join(',');
    } else {
      return null;
    }
  },

  responsiveBackgroundImageCSSVars(image, params) {
    if (image?.url && this.isValidUrl(image.url) && params) {
      return {
        '--bg-img-small': `url('${this.optimisedSrc(image, params.small)}')`,
        '--bg-img-medium': `url('${this.optimisedSrc(image, params.medium)}')`,
        '--bg-img-large': `url('${this.optimisedSrc(image, params.large)}')`,
        '--bg-img-xl': `url('${this.optimisedSrc(image, params.xl)}')`,
        '--bg-img-xxl': `url('${this.optimisedSrc(image, params.xxl)}')`,
        '--bg-img-xxxl': `url('${this.optimisedSrc(image, params.xxxl)}')`,
        '--bg-img-wqhd': `url('${this.optimisedSrc(image, params.wqhd)}')`,
        '--bg-img-4k': `url('${this.optimisedSrc(image, params['4k'])}')`
      };
    } else if (image.url) {
      return {
        '--bg-img-small': `url('${image.url}')`
      };
    } else {
      return null;
    }
  }
});
