// TODO: remove if unused
// Defaults for custom `imageDisplayProfile` content type
// const CONTENTFUL_IMAGE_DISPLAY_PROFILE_DEFAULTS = {
//   crop: true,
//   fit: null,
//   focus: 'center',
//   name: null,
//   overlay: true,
//   quality: 40,
//   sizes: ['small', 'medium', 'large', 'xl', 'xxl', 'xxxl', 'wqhd', '4k', '4k+']
// };
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

  imageApiParamsForImageDisplayProfile(profile) {
    return {
      ...profile?.focus && { f: profile.focus },
      ...profile?.fit && { fit: profile.fit },
      ...profile?.quality && { q: profile.quality }
    };
  },

  imageDisplayProfileResponsiveSizes(sizes, profile) {
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
  },

  // TODO: remove if unused
  // imageDisplayProfileWithDefaults(entryProfile = {}) {
  //   return {
  //     ...CONTENTFUL_IMAGE_DISPLAY_PROFILE_DEFAULTS,
  //     ...entryProfile
  //   };
  // },

  isValidUrl(url) {
    try {
      return (new URL(url)).host === CONTENTFUL_IMAGES_ASSET_HOST;
    } catch (e) {
      return false;
    }
  },

  optimisedSrc(asset, options = {}, profile = {}) {
    // TODO: use isValidUrl here?
    if (!asset?.url) {
      return null;
    }
    const imageUrl = new URL(asset.url);
    const profileParams = this.imageApiParamsForImageDisplayProfile(profile);

    const params = { ...options, ...profileParams };

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

  responsiveImageSrcset(image, sizes, profile) {
    if (this.isValidUrl(image?.url) && sizes) {
      const profileSizes = this.imageDisplayProfileResponsiveSizes(sizes, profile);

      return Object.keys(profileSizes)
        .map((size) => {
          const url = this.optimisedSrc(image, profileSizes[size], profile);
          return `${url} ${profileSizes[size].w}w`;
        })
        .join(',');
    } else {
      return null;
    }
  },

  responsiveBackgroundImageCSSVars(image, sizes, profile) {
    if (this.isValidUrl(image?.url) && sizes) {
      const profileSizes = this.imageDisplayProfileResponsiveSizes(sizes, profile);

      return Object.keys(profileSizes).reduce((memo, size) => {
        const url = this.optimisedSrc(image, profileSizes[size], profile);
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
});
