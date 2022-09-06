
export function urlIsContentfulAsset(url) {
  return (new URL(url)).host === 'images.ctfassets.net';
}

// TODO: refactor as a mixin so that the store is available and acceptMediaTypes
//       does not need to be passed by all callers
export function optimisedSrcForContentfulAsset(asset, params = {}, { acceptMediaTypes = [] } = {}) {
  if (!asset?.url) {
    return null;
  }
  const imageUrl = new URL(asset.url);

  if (!params.fm && acceptMediaTypes.includes('image/webp')) {
    params.fm = 'webp';
    if (!params.q) {
      params.q = 40;
    }
  } else if (asset.contentType === 'image/jpeg') {
    params.fm = 'jpg';
    params.fl = 'progressive';
    if (!params.q) {
      params.q = 80;
    }
  }

  for (const key in params)  {
    imageUrl.searchParams.set(key, params[key]);
  }

  return imageUrl.toString();
}

export function responsiveImageSrcset(image, params, options = {}) {
  if (image?.url && urlIsContentfulAsset(image.url) && params) {
    return [
      `${optimisedSrcForContentfulAsset(image, params.small, options)} ${params.small.w}w`,
      `${optimisedSrcForContentfulAsset(image, params.medium, options)} ${params.medium.w}w`,
      `${optimisedSrcForContentfulAsset(image, params.large, options)} ${params.large.w}w`,
      `${optimisedSrcForContentfulAsset(image, params.xl, options)} ${params.xl.w}w`,
      `${optimisedSrcForContentfulAsset(image, params.xxl, options)} ${params.xxl.w}w`,
      `${optimisedSrcForContentfulAsset(image, params.xxxl, options)} ${params.xxxl.w}w`,
      `${optimisedSrcForContentfulAsset(image, params.wqhd, options)} ${params.wqhd.w}w`,
      `${optimisedSrcForContentfulAsset(image, params['4k'], options)} ${params['4k'].w}w`
    ].join(',');
  } else if (image?.url) {
    return image.url;
  } else {
    return null;
  }
}

export function responsiveBackgroundImageCSSVars(image, params, options = {}) {
  if (image.url && urlIsContentfulAsset(image.url) && params) {
    return {
      '--bg-img-small': `url('${optimisedSrcForContentfulAsset(image, params.small, options)}')`,
      '--bg-img-medium': `url('${optimisedSrcForContentfulAsset(image, params.medium, options)}')`,
      '--bg-img-large': `url('${optimisedSrcForContentfulAsset(image, params.large, options)}')`,
      '--bg-img-xl': `url('${optimisedSrcForContentfulAsset(image, params.xl, options)}')`,
      '--bg-img-xxl': `url('${optimisedSrcForContentfulAsset(image, params.xxl, options)}')`,
      '--bg-img-xxxl': `url('${optimisedSrcForContentfulAsset(image, params.xxxl, options)}')`,
      '--bg-img-wqhd': `url('${optimisedSrcForContentfulAsset(image, params.wqhd, options)}')`,
      '--bg-img-4k': `url('${optimisedSrcForContentfulAsset(image, params['4k'], options)}')`
    };
  } else if (image.url) {
    return {
      '--bg-img-small': `url('${image.url}')`
    };
  } else {
    return null;
  }
}
