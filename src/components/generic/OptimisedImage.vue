<template>
  <b-img-lazy
    v-if="lazy"
    :src="optimisedSrc"
    blank-color="#fff"
    :blank-width="optimisedWidth"
    :blank-height="optimisedHeight"
    :alt="alt"
  />
  <b-img
    v-else
    :src="optimisedSrc"
    :width="optimisedWidth"
    :height="optimisedHeight"
    :alt="alt"
  />
</template>

<script>
  import { urlIsContentfulAsset, optimisedSrcForContentfulAsset } from '@/plugins/contentful-utils';
  export default {
    name: 'OptimisedImage',

    props: {
      src: {
        type: String,
        required: true
      },
      width: {
        type: Number,
        required: true
      },
      height: {
        type: Number,
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
        if (typeof this.contentType !== 'string' || !urlIsContentfulAsset(this.src)) {
          return this.src;
        }
        return optimisedSrcForContentfulAsset(
          { url: this.src, contentType: this.contentType },
          { w: this.maxWidth, q: this.quality },
          { acceptMediaTypes: this.$store?.state?.http?.acceptMediaTypes }
        );
      }
    }
  };
</script>
