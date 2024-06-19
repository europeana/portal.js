const CONTENTFUL_IMAGES_ASSET_HOST = 'images.ctfassets.net';
const CONTENTFUL_IMAGES_PARAMS_FL_PROGRESSIVE = 'progressive';
const CONTENTFUL_IMAGES_PARAMS_FM_WEBP = 'webp';
const CONTENTFUL_IMAGES_PARAMS_FM_JPEG = 'jpg';
const MEDIA_TYPE_JPEG = 'image/jpeg';
const MEDIA_TYPE_SVG = 'image/svg+xml';

const imageApiParamsForImageDisplayProfile = (profile) => {
  return {
    ...profile?.focus && { f: profile.focus },
    ...profile?.fit && { fit: profile.fit },
    ...profile?.quality && { q: profile.quality }
  };
};

export const contentfulImageDisplayProfileResponsiveSizes = (sizes, profile) => {
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
};

export const isContentfulAssetUrl = (url) => {
  try {
    return (new URL(url)).host === CONTENTFUL_IMAGES_ASSET_HOST;
  } catch (e) {
    return false;
  }
};

export const optimisedContentfulImageUrl = (asset, params, options = {}) => {
  const { profile } = options;

  if (!isContentfulAssetUrl(asset?.url)) {
    return asset?.url || null;
  }
  const imageUrl = new URL(asset.url);
  const profileParams = imageApiParamsForImageDisplayProfile(profile);

  const localParams = { ...params, ...profileParams };

  if (!localParams.fm && (asset.contentType !== MEDIA_TYPE_SVG)) {
    localParams.fm = CONTENTFUL_IMAGES_PARAMS_FM_WEBP;
    if (!localParams.q) {
      localParams.q = 40;
    }
  } else if (asset.contentType === MEDIA_TYPE_JPEG) {
    localParams.fm = CONTENTFUL_IMAGES_PARAMS_FM_JPEG;
    localParams.fl = CONTENTFUL_IMAGES_PARAMS_FL_PROGRESSIVE;
    if (!localParams.q) {
      localParams.q = 80;
    }
  }

  for (const key in localParams)  {
    if (localParams[key]) {
      imageUrl.searchParams.set(key, localParams[key]);
    }
  }

  return imageUrl.toString();
};

export const responsiveContentfulImageSrcset = (image, sizes, profile) => {
  if (isContentfulAssetUrl(image?.url) && sizes) {
    const profileSizes = contentfulImageDisplayProfileResponsiveSizes(sizes, profile);

    return Object.keys(profileSizes)
      .map((size) => {
        const url = optimisedContentfulImageUrl(image, profileSizes[size], { profile });
        return `${url} ${profileSizes[size].w}w`;
      })
      .join(',');
  } else {
    return null;
  }
};

export const responsiveContentfulBackgroundImageCSSVars = (image, sizes, profile) => {
  if (isContentfulAssetUrl(image?.url) && sizes) {
    const profileSizes = contentfulImageDisplayProfileResponsiveSizes(sizes, profile);

    return Object.keys(profileSizes).reduce((memo, size) => {
      const url = optimisedContentfulImageUrl(image, profileSizes[size], { profile });
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
};
