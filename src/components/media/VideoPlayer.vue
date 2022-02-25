<template>
  <!--
    `key` attribute is needed to force replacement of the entire video element
    when `src` updates as `source` elements may not have their `src` attribute
    updated after render.
  -->
  <video
    :key="src"
    ref="videoPlayer"
    :autoplay="autoplay"
    :controls="controls"
    :loop="loop"
    :muted="muted"
    :width="width"
    :height="height"
    data-qa="video player"
    class="video-js"
  />
</template>

<script>
  import videojs from 'video.js';
  import 'video.js/dist/video-js.css';

  export default {
    name: 'VideoPlayer',

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
    },

    data() {
      return {
        player: null
      };
    },

    computed: {
      videojsOptions() {
        return {
          sources: [
            {
              // media proxy does not work with DASH...
              // src: this.$apis.record.mediaProxyUrl(this.src, this.europeanaIdentifier),
              src: this.src,
              type: this.type
            }
          ]
        };
      }
    },

    mounted() {
      this.player = videojs(this.$refs.videoPlayer, this.videojsOptions);
    },

    beforeDestroy() {
      if (this.player) {
        this.player.dispose();
      }
    }
  };
</script>
