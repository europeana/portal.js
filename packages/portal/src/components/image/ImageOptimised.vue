<template>
  <picture
    v-if="Array.isArray(imageSrcset)"
  >
    <template
      v-for="(srcset, index) in imageSrcset"
    >
      <img
        v-if="index === 0"
        :key="index"
        :src="src"
        :srcset="srcset"
        :sizes="imageSizes"
        :alt="alt"
      >
      <source
        v-else
        :key="index"
        :srcset="srcset"
        :sizes="imageSizes"
        :media="`(resolution: ${index + 1}x)`"
      >
    </template>
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
      /**
       * Image srcset(s)
       *
       * If an array, first item is taken as 1x resolution and gets an `img`
       * element; other item are taken as for increasing resolutions, e.g.
       * second item is 2x resolution, third is 3x resolution, etc, and get
       * `source` elements.
       */
      imageSrcset: {
        type: [String, Array],
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
