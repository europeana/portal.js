<template>
  <figure>
    <ImageOptimised
      v-if="src"
      ref="image"
      :src="src"
      :width="width"
      :height="height"
      :alt="alt"
      :content-type="contentType"
      :max-width="maxWidth"
      data-qa="image"
      :image-srcset="imageSrcset"
      :image-sizes="imageSizes"
      :lazy="lazy"
    />
    <AttributionToggle
      :attribution="attribution"
    />
  </figure>
</template>

<script>
  import AttributionToggle from '../generic/AttributionToggle';
  import ImageOptimised from './ImageOptimised';

  export default {
    name: 'ImageWithAttribution',

    components: {
      AttributionToggle,
      ImageOptimised
    },

    props: {
      src: {
        type: String,
        required: true,
        default: null
      },
      width: {
        type: [Number, String],
        default: 550
      },
      height: {
        type: [Number, String],
        default: 790
      },
      alt: {
        type: String,
        default: ''
      },
      contentType: {
        type: String,
        default: null
      },
      attribution: {
        type: Object,
        required: true
      },
      maxWidth: {
        type: Number,
        default: 1100
      },
      imageSrcset: {
        type: [String, Array],
        default: null
      },
      imageSizes: {
        type: String,
        default: null
      },
      lazy: {
        type: Boolean,
        default: true
      }
    }
  };
</script>

<style lang="scss" scoped>
figure {
  overflow: hidden;

  ::v-deep img {
    width: 100%;
    object-fit: cover;
  }
}
</style>
