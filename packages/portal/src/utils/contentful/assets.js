const CONTENTFUL_IMAGES_ASSET_HOST = 'images.ctfassets.net';
const CONTENTFUL_IMAGES_PARAMS_FL_PROGRESSIVE = 'progressive';
const CONTENTFUL_IMAGES_PARAMS_FM_WEBP = 'webp';
const CONTENTFUL_IMAGES_PARAMS_FM_JPEG = 'jpg';
const MEDIA_TYPE_JPEG = 'image/jpeg';
const MEDIA_TYPE_SVG = 'image/svg+xml';

function imageApiParamsForImageDisplayProfile(profile) {
  return {
    ...profile?.focus && { f: profile.focus },
    ...profile?.fit && { fit: profile.fit },
    ...profile?.quality && { q: profile.quality }
  };
}

export function imageDisplayProfileResponsiveSizes(sizes, profile) {
  const deleteHeight = profile?.fit === 'pad' && !profile?.crop;

  return Object.keys(sizes).reduce((memo, size) => {
    if (!profile || profile.sizes.includes(size)) {
      memo[size] = { ...sizes[size] };

      if (deleteHeight) {
        delete memo[size].h;
      }
    }
    return memo;
  }, {});
}

export function isValidUrl(url) {
  try {
    return (new URL(url)).host === CONTENTFUL_IMAGES_ASSET_HOST;
  } catch (e) {
    return false;
  }
}

export function optimisedSrc(asset, options = {}, profile = {}) {
  if (!isValidUrl(asset?.url)) {
    return asset?.url || null;
  }

  const imageUrl = new URL(asset.url);
  const profileParams = imageApiParamsForImageDisplayProfile(profile);

  const params = { ...options, ...profileParams };

  if (!params.fm && (asset.contentType !== MEDIA_TYPE_SVG)) {
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
}

export function responsiveImageSrcset(image, sizes, profile) {
  if (isValidUrl(image?.url) && sizes) {
    const profileSizes = imageDisplayProfileResponsiveSizes(sizes, profile);

    return Object.keys(profileSizes)
      .map((size) => {
        const url = optimisedSrc(image, profileSizes[size], profile);
        return `${url} ${profileSizes[size].w}w`;
      })
      .join(',');
  } else {
    return null;
  }
}

export function responsiveBackgroundImageCSSVars(image, sizes, profile) {
  if (isValidUrl(image?.url) && sizes) {
    const profileSizes = imageDisplayProfileResponsiveSizes(sizes, profile);

    return Object.keys(profileSizes).reduce((memo, size) => {
      const url = optimisedSrc(image, profileSizes[size], profile);
      memo[`--bg-img-${size}`] = `url('${url}')`;
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
