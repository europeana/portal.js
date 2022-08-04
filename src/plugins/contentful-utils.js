
export function urlIsContentfulAsset(url) {
  return (new URL(url)).host === 'images.ctfassets.net';
}

export function optimisedSrcForContentfulAsset(asset, params = {}) {
  if (!asset?.url) {
    return null;
  }
  const imageUrl = new URL(asset.url);

  // TODO: are optimisations possible on any other content types?
  if (asset.contentType === 'image/jpeg') {
    params['fm'] = 'jpg';
    params['fl'] = 'progressive';
    if (!params.q) {
      params.q = 80;
    }
  }

  for (const key in params)  {
    imageUrl.searchParams.set(key, params[key]);
  }

  return imageUrl.toString();
}

export function responsiveImageSrcset(image, params) {
  if (image.url && urlIsContentfulAsset(image.url) && params) {
    return [
      `${optimisedSrcForContentfulAsset(image, params.small)} ${params.small.w}w`,
      `${optimisedSrcForContentfulAsset(image, params.medium)} ${params.medium.w}w`,
      `${optimisedSrcForContentfulAsset(image, params.large)} ${params.large.w}w`,
      `${optimisedSrcForContentfulAsset(image, params.xl)} ${params.xl.w}w`,
      `${optimisedSrcForContentfulAsset(image, params.xxl)} ${params.xxl.w}w`,
      `${optimisedSrcForContentfulAsset(image, params.xxxl)} ${params.xxxl.w}w`,
      `${optimisedSrcForContentfulAsset(image, params.wqhd)} ${params.wqhd.w}w`,
      `${optimisedSrcForContentfulAsset(image, params['4k'])} ${params['4k'].w}w`
    ].join(',');
  } else if (image.url) {
    return image.url;
  } else {
    return null;
  }
}

export function responsiveBackgroundImageCSSVars(image, params) {
  if (image.url && urlIsContentfulAsset(image.url) && params) {
    return {
      '--bg-img-small': `url('${optimisedSrcForContentfulAsset(image, params.small)}')`,
      '--bg-img-medium': `url('${optimisedSrcForContentfulAsset(image, params.medium)}')`,
      '--bg-img-large': `url('${optimisedSrcForContentfulAsset(image, params.large)}')`,
      '--bg-img-xl': `url('${optimisedSrcForContentfulAsset(image, params.xl)}')`,
      '--bg-img-xxl': `url('${optimisedSrcForContentfulAsset(image, params.xxl)}')`,
      '--bg-img-xxxl': `url('${optimisedSrcForContentfulAsset(image, params.xxxl)}')`,
      '--bg-img-wqhd': `url('${optimisedSrcForContentfulAsset(image, params.wqhd)}')`,
      '--bg-img-4k': `url('${optimisedSrcForContentfulAsset(image, params['4k'])}')`
    };
  } else if (image.url) {
    return {
      '--bg-img-small': `url('${image.url}')`
    };
  } else {
    return null;
  }
}
