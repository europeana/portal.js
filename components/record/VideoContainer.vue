<template>
  <no-ssr>
    <video-player
      ref="videoPlayer"
      class="video-player-box"
      :options="playerOptions"
    />
  </no-ssr>
</template>

<script>
  let videoPlayer;
  if (process.browser) {
    require('video.js/dist/video-js.css');
    videoPlayer = require('vue-video-player').videoPlayer;
  }

  export default {
    components: process.browser ? {
      videoPlayer
    } : {},
    props: {
      url: {
        type: String,
        default: ''
      },
      mimeType: {
        type: String,
        default: ''
      },
      image: {
        type: String,
        default: ''
      }
    },
    computed: {
      playerOptions() {
        return {
          sources: [{
            type: this.mimeType,
            src: this.url
          }],
          poster: this.image
        };
      },
      player() {
        return this.$refs.videoPlayer.player;
      }
    }
  };
</script>
