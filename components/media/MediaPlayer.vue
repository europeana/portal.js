<template>
  <!--
    `key` attribute is needed to force replacement of the entire video element
    when `src` updates as `source` elements may not have their `src` attribute
    updated after render.
  -->
  <div
    ref="player"
    class="media-player-wrapper"
    :style="{ paddingBottom: ratio +'%' }"
  >
    <iframe
      :key="src"
      :src="mediaSrc"
      :style="{ maxWidth: iframeWidth + 'px', maxHeight: iframeHeight + 'px' }"
      allowfullscreen
      class="media-player"
    />
  </div>
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
        default: 640
      },
      height: {
        type: Number,
        default: 360
      }
    },

    data() {
      return {
        iframeWidth: this.height,
        iframeHeight: this.width,
        ratio: 0,
        mediaSrc: null
      };
    },

    computed: {
      manifest() {
        return `https://iiif.europeana.eu/presentation${this.europeanaIdentifier}/manifest?format=3&wskey=${process.env['EUROPEANA_RECORD_API_KEY']}`;
      }
    },

    mounted() {
      this.ratio = (this.height * 100) / this.width;

      this.iframeWidth = this.$refs.player.clientWidth;
      this.iframeHeight = this.iframeWidth * this.ratio / 100;

      this.mediaSrc = `${process.env['EUROPEANA_MEDIA_ENDPOINT']}/?manifest=${this.manifest}&id=${this.europeanaIdentifier}&width=${this.iframeWidth}&height=${this.iframeHeight}`;
    }
  };
</script>

<style lang="scss" scoped>
  .media-player-wrapper {
    position: relative;
    height: 0;
    overflow: hidden;
    width: 100%;

    iframe {
      border: 0;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  }
</style>
