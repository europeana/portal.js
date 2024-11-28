<template>
  <div
    class="media-player-wrapper col-lg-10 col-12"
  >
    <component
      :is="format.startsWith('video/') ? 'video' : 'audio'"
      :key="url"
      ref="avPlayer"
      class="media-player video-js"
      controls
      :title="$t('record.mediaPlayer')"
      :poster="poster"
    />
  </div>
</template>

<script>
  import videojs from 'video.js';
  // TODO: don't import this; write our own CSS in this component instead
  import 'video.js/dist/video-js.min.css';

  export default {
    name: 'MediaAudioVisualPlayer',

    props: {
      format: {
        type: String,
        default: null
      },

      itemId: {
        type: String,
        default: null
      },

      poster: {
        type: String,
        default: null
      },

      url: {
        type: String,
        required: true
      }
    },

    data() {
      return {
        options: {
          controlBar: {
            children: [
              'progressControl',
              'playToggle',
              'remainingTimeDisplay',
              'muteToggle',
              'volumeControl',
              'subtitlesButton',
              'subsCapsButton',
              'fullcreenToggle'
            ]
          }
        },
        player: null
      };
    },

    mounted() {
      this.player = videojs(this.$refs.avPlayer, {
        ...this.options,
        sources: [
          {
            src: this.url,
            type: this.format
          }
        ]
      });
    },

    beforeDestroy() {
      if (this.player) {
        this.player.dispose();
      }
    }
  };
</script>

<style lang="scss" scoped>
  .media-player-wrapper {
    position: relative;
    height: 100%;
    margin: 0 auto;
    overflow: hidden;
    min-width: 19rem;
  }
</style>
