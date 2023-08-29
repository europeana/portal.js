<template>
  <figure>
    <ImageOptimised
      v-if="src"
      :src="src"
      :width="width"
      :height="height"
      :alt="alt"
      :content-type="contentType"
      :max-width="maxWidth"
      data-qa="image"
      :image-srcset="imageSrcset"
      :image-sizes="imageSizes"
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
        type: Number,
        default: 550
      },
      height: {
        type: Number,
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
        type: String,
        default: null
      },
      imageSizes: {
        type: String,
        default: null
      }
    }
  };
</script>

<style lang="scss" scoped>
figure {
  overflow: hidden;

  img {
    width: 100%;
    object-fit: cover;
  }
}
</style>
