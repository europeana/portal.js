<template>
  <!--
    `key` attribute is needed to force replacement of the entire video element
    when `src` updates as `source` elements may not have their `src` attribute
    updated after render.
  -->
  <iframe
    :key="src"
    :src="mediaSrc"
    :width="width"
    :height="height"
    allow="fullscreen"
    :style="{ width: width, height: height }"
    class="media-player"
  />
</template>

<script>
  export default {
    name: 'MediaPlayer',

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
      width: {
        type: Number,
        default: null
      },
      height: {
        type: Number,
        default: null
      }
    },

    computed: {
      manifest() {
        return `https://iiif.europeana.eu/presentation/${this.europeanaIdentifier}/manifest?format=3&wskey=${process.env['EUROPEANA_RECORD_API_KEY']}`;
      },
      mediaSrc() {
        return `http://europeana-media-video-embed.eanadev.org/?manifest=${this.manifest}&width=${this.width}&height=${this.height}`;
      }
    }
  };
</script>

<style lang="scss" scoped>
  iframe {
    border: 0;
  }
</style>

