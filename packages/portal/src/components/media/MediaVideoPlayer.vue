<template>
  <!--
    `key` attribute is needed to force replacement of the entire video element
    when `src` updates as `source` elements may not have their `src` attribute
    updated after render.
  -->
  <video
    :key="src"
    :controls="controls"
    :autoplay="autoplay"
    :loop="loop"
    :muted="muted"
    :width="width"
    :height="height"
    data-qa="video"
  >
    <source
      :src="$apis.record.mediaProxyUrl(src, europeanaIdentifier)"
      :type="type"
      data-qa="video source"
    >
  </video>
</template>

<script>
  export default {
    name: 'MediaVideoPlayer',

    props: {
      europeanaIdentifier: {
        type: String,
        required: true
      },
      src: {
        type: String,
        required: true
      },
      type: {
        type: String,
        required: true
      },
      controls: {
        type: Boolean,
        default: true
      },
      autoplay: {
        type: Boolean,
        default: false
      },
      loop: {
        type: Boolean,
        default: false
      },
      muted: {
        type: Boolean,
        default: false
      },
      width: {
        type: Number,
        default: null
      },
      height: {
        type: Number,
        default: null
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';
  @import '@europeana/style/scss/mixins';

  video {
    @include media-viewer-height;
    max-width: 100%;
    width: auto;
    display: block;
    margin-right: auto;
    margin-left: auto;

    @media (max-width: ($bp-large - 1px)) {
      max-height: 100%;
    }
  }
</style>
