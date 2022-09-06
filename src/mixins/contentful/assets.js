export default {
  computed: {
    acceptMediaTypes() {
      return this.$store?.state?.http?.acceptMediaTypes;
    }
  },

  methods: {
    urlIsContentfulAsset(url) {
      try {
        return (new URL(url)).host === 'images.ctfassets.net';
      } catch (e) {
        return false;
      }
    },

    optimisedSrcForContentfulAsset(asset, params = {}) {
      if (!asset?.url) {
        return null;
      }
      const imageUrl = new URL(asset.url);

      if (!params.fm && this.acceptMediaTypes?.includes('image/webp')) {
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
    },

    contentfulResponsiveImageSrcset(image, params) {
      if (image?.url && this.urlIsContentfulAsset(image.url) && params) {
        return [
          `${this.optimisedSrcForContentfulAsset(image, params.small)} ${params.small.w}w`,
          `${this.optimisedSrcForContentfulAsset(image, params.medium)} ${params.medium.w}w`,
          `${this.optimisedSrcForContentfulAsset(image, params.large)} ${params.large.w}w`,
          `${this.optimisedSrcForContentfulAsset(image, params.xl)} ${params.xl.w}w`,
          `${this.optimisedSrcForContentfulAsset(image, params.xxl)} ${params.xxl.w}w`,
          `${this.optimisedSrcForContentfulAsset(image, params.xxxl)} ${params.xxxl.w}w`,
          `${this.optimisedSrcForContentfulAsset(image, params.wqhd)} ${params.wqhd.w}w`,
          `${this.optimisedSrcForContentfulAsset(image, params['4k'])} ${params['4k'].w}w`
        ].join(',');
      } else if (image?.url) {
        return image.url;
      } else {
        return null;
      }
    },

    contentfulResponsiveBackgroundImageCSSVars(image, params) {
      if (image?.url && this.urlIsContentfulAsset(image.url) && params) {
        return {
          '--bg-img-small': `url('${this.optimisedSrcForContentfulAsset(image, params.small)}')`,
          '--bg-img-medium': `url('${this.optimisedSrcForContentfulAsset(image, params.medium)}')`,
          '--bg-img-large': `url('${this.optimisedSrcForContentfulAsset(image, params.large)}')`,
          '--bg-img-xl': `url('${this.optimisedSrcForContentfulAsset(image, params.xl)}')`,
          '--bg-img-xxl': `url('${this.optimisedSrcForContentfulAsset(image, params.xxl)}')`,
          '--bg-img-xxxl': `url('${this.optimisedSrcForContentfulAsset(image, params.xxxl)}')`,
          '--bg-img-wqhd': `url('${this.optimisedSrcForContentfulAsset(image, params.wqhd)}')`,
          '--bg-img-4k': `url('${this.optimisedSrcForContentfulAsset(image, params['4k'])}')`
        };
      } else if (image.url) {
        return {
          '--bg-img-small': `url('${image.url}')`
        };
      } else {
        return null;
      }
    }
  }
};
