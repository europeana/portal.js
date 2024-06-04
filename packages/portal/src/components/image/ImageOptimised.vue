<template>
  <picture
    v-if="responsiveImageSrcsets"
  >
    <template
      v-for="(srcset, index) in responsiveImageSrcsets"
    >
      <ImageEagerOrLazy
        v-if="index === 0"
        :key="index"
        :alt="alt"
        :blank-color="blankColor"
        :height="optimisedHeight"
        :lazy="lazy"
        :sizes="imageSizes"
        :src="optimisedSrc"
        :srcset="srcset"
        :width="optimisedWidth"
      />
      <source
        v-else
        :key="index"
        :srcset="srcset"
        :sizes="imageSizes"
        :media="`(resolution: ${index + 1}x)`"
      >
    </template>
  </picture>
  <ImageEagerOrLazy
    v-else
    :alt="alt"
    :blank-color="blankColor"
    :height="optimisedHeight"
    :lazy="lazy"
    :sizes="imageSizes"
    :src="optimisedSrc"
    :width="optimisedWidth"
  />
</template>

<script>
  import ImageEagerOrLazy from './ImageEagerOrLazy';

  export default {
    name: 'ImageOptimised',

    components: {
      ImageEagerOrLazy
    },

    props: {
      src: {
        type: String,
        required: true
      },
      width: {
        type: [Number, String],
        required: true
      },
      height: {
        type: [Number, String],
        required: true
      },
      alt: {
        type: String,
        default: ''
      },
      contentType: {
        // TODO: required?
        type: String,
        default: null
      },
      quality: {
        type: Number,
        default: 80
      },
      maxWidth: {
        type: Number,
        default: null
      },
      lazy: {
        type: Boolean,
        default: true
      },
      contentfulImageCropPresets: {
        type: Object,
        default: null
      },
      contentfulImageDisplayProfile: {
        type: Object,
        default: null
      },
      pictureSourceMediaResolutions: {
        type: Array,
        default: () => [1]
      },
      imageSizes: {
        type: String,
        default: null
      }
    },

    data() {
      return {
        blankColor: '#fff',
        isContentfulAsset: this.$contentful?.assets?.isValidUrl(this.src) || false
      };
    },

    computed: {
      aspectRatio() {
        return this.width / this.height;
      },

      isSVG() {
        return this.contentType === 'image/svg+xml';
      },

      optimisedWidth() {
        return (this.maxWidth === null || this.width <= this.maxWidth) ? this.width : this.maxWidth;
      },

      optimisedHeight() {
        return Math.round(this.optimisedWidth / this.aspectRatio);
      },

      optimisedSrc() {
        if (typeof this.contentType !== 'string' || !this.isContentfulAsset || this.isSVG) {
          return this.src;
        }
        return this.$contentful.assets.optimisedSrc(
          { url: this.src, contentType: this.contentType },
          { w: this.maxWidth, q: this.quality }
        );
      },

      responsiveImageSrcsets() {
        if (!this.isContentfulAsset || !this.contentfulImageCropPresets) {
          return null;
        }

        return this.pictureSourceMediaResolutions.map((resolution) => {
          const resolutionSizes = Object.keys(this.contentfulImageCropPresets).reduce((memo, key) => {
            memo[key] = {
              ...this.contentfulImageCropPresets[key],
              w: this.contentfulImageCropPresets[key].w * resolution,
              h: this.contentfulImageCropPresets[key].h * resolution
            };
            return memo;
          }, {});

          return this.$contentful.assets.responsiveImageSrcset(
            { contentType: this.contentType, url: this.src },
            resolutionSizes,
            this.contentfulImageDisplayProfile
          );
        });
      }
    }
  };
</script>
