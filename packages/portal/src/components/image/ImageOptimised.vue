<template>
  <picture v-if="imageSrcsetsPerResolution">
    <source
      :srcset="imageSrcsetsPerResolution['2x']"
      :sizes="imageSizes"
      media="(resolution: 2x)"
    >
    <source
      :srcset="imageSrcsetsPerResolution['3x']"
      :sizes="imageSizes"
      media="(resolution: 3x)"
    >
    <img
      :src="src"
      :srcset="imageSrcsetsPerResolution['1x']"
      :sizes="imageSizes"
      :alt="alt"
    >
  </picture>
  <b-img-lazy
    v-else-if="lazy"
    :src="optimisedSrc"
    blank-color="#fff"
    :blank-width="optimisedWidth"
    :blank-height="optimisedHeight"
    :alt="alt"
    :srcset="imageSrcset"
    :sizes="imageSizes"
  />
  <b-img
    v-else
    :src="optimisedSrc"
    :width="optimisedWidth"
    :height="optimisedHeight"
    :alt="alt"
    :srcset="imageSrcset"
    :sizes="imageSizes"
  />
</template>

<script>
  export default {
    name: 'ImageOptimised',

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
      imageSrcset: {
        type: String,
        default: null
      },
      imageSrcsetsPerResolution: {
        type: Object,
        default: null
      },
      imageSizes: {
        type: String,
        default: null
      }
    },

    computed: {
      aspectRatio() {
        return this.width / this.height;
      },

      optimisedWidth() {
        return (this.maxWidth === null || this.width <= this.maxWidth) ? this.width : this.maxWidth;
      },

      optimisedHeight() {
        return Math.round(this.optimisedWidth / this.aspectRatio);
      },

      optimisedSrc() {
        if (typeof this.contentType !== 'string' || !this.$contentful.assets.isValidUrl(this.src) || this.isSVG) {
          return this.src;
        }
        return this.$contentful.assets.optimisedSrc(
          { url: this.src, contentType: this.contentType },
          { w: this.maxWidth, q: this.quality }
        );
      },
      isSVG() {
        return this.contentType === 'image/svg+xml';
      }
    }
  };
</script>
